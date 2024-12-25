const { italic, bold } = require("discord.js");
const { Combatant, Adventure, ModifierReceipt } = require("../classes");
const { getInverse, getModifierDescription, getModifierCategory } = require("../modifiers/_modifierDictionary");
const { getEmoji, getCounteredEssences, essenceList } = require("./essenceUtil.js");
const { getApplicationEmojiMarkdown } = require("./graphicsUtil.js");
const { listifyEN } = require("./textUtil.js");
const { areSetContentsCongruent } = require("./mathUtil.js");
const { ZERO_WIDTH_WHITESPACE } = require("../constants");

/**
 * @param {Combatant} target
 * @param {Adventure} adventure
 */
function downedCheck(target, adventure) {
	if (target.hp <= 0) {
		if (target.team === "delver") {
			target.hp = target.getMaxHP();
			adventure.lives = Math.max(adventure.lives - 1, 0);
			return ` ${bold(`${target.name} was downed${adventure.lives > 0 ? " and revived" : ""}.`)}${ZERO_WIDTH_WHITESPACE}`; // need ZWW for md format nesting
		} else {
			target.hp = 0;
			return ` ${bold(`${target.name} was downed`)}.${ZERO_WIDTH_WHITESPACE}`;
		}
	} else {
		return "";
	}
}

/**
 * @param {number} previousLives
 * @param {number} currentLives
 */
function livesCheck(previousLives, currentLives) {
	if (currentLives < previousLives) {
		if (currentLives > 1) {
			return italic(`${currentLives} LIVES REMAIN`);
		} else if (currentLives === 1) {
			return italic(`${currentLives} LIFE REMAINS`);
		} else {
			return italic("GAME OVER");
		}
	}
	return null;
}

/**
 * @param {Combatant[]} targets
 * @param {Combatant} assailant
 * @param {number} damage
 * @param {boolean} isUnblockable
 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned"} essence
 * @param {Adventure} adventure
 */
function dealDamage(targets, assailant, damage, isUnblockable, essence, adventure) {
	const previousLifeCount = adventure.lives;
	const results = [];
	for (const target of targets) {
		if (target.hp > 0) { // Skip if target is downed (necessary for multi-hit moves hitting same target)
			if (!(`${essence} Absorption` in target.modifiers)) {
				if (!("Evade" in target.modifiers) || isUnblockable) {
					let pendingDamage = damage;
					if ("Exposed" in target.modifiers) {
						pendingDamage *= 1.5;
						removeModifier([target], { name: "Exposed", stacks: 1, force: true });
					}
					const isCounter = getCombatantCounters(target).includes(essence);
					if (isCounter) {
						pendingDamage += assailant.getEssenceCounterDamage();
					}
					pendingDamage = Math.ceil(pendingDamage);
					let blockedDamage = 0;
					if (!isUnblockable) {
						if (pendingDamage >= target.protection) {
							pendingDamage -= target.protection;
							blockedDamage = target.protection;
							target.protection = 0;
						} else {
							target.protection -= pendingDamage;
							blockedDamage = pendingDamage;
							pendingDamage = 0;
						}
					}
					pendingDamage = Math.min(pendingDamage, assailant.getDamageCap());
					target.hp -= pendingDamage;
					results.push(`${target.name} takes ${pendingDamage} ${getEmoji(essence)} damage${blockedDamage > 0 ? ` (${blockedDamage} was blocked)` : ""}${isCounter ? "!" : "."}${downedCheck(target, adventure)}`);
					if (pendingDamage > 0 && "Curse of Midas" in target.modifiers) {
						const midasGold = Math.floor(pendingDamage / 10 * target.modifiers["Curse of Midas"]);
						adventure.room.addResource("Gold", "Currency", "loot", midasGold);
						results.push(`${getApplicationEmojiMarkdown("Curse of Midas")}: Loot +${midasGold}g`)
					}
				} else {
					removeModifier([target], { name: "Evade", stacks: 1, force: true });
					results.push(`${target.name} evades the attack!`);
				}
			} else {
				results.push(gainHealth(target, damage, adventure, "Essence Absorption"));
			}
		}
	}
	const lifeLine = livesCheck(previousLifeCount, adventure.lives);
	if (lifeLine) {
		results.push(lifeLine);
	}
	return results;
}

const MODIFIER_DAMAGE_PER_STACK = {
	Poison: 10,
	Frail: 20
};

/** modifier damage doesn't have an essence and doesn't interact with other modifiers (eg Exposed & Curse of Midas)
 * @param {Combatant} target
 * @param {"Poison" | "Frail"} modifier
 * @param {Adventure} adventure
 */
function dealModifierDamage(target, modifier, adventure) {
	const previousLifeCount = adventure.lives;
	const stacks = target.getModifierStacks(modifier);
	let pendingDamage = stacks * MODIFIER_DAMAGE_PER_STACK[modifier];
	const funnelCount = adventure.getArtifactCount("Spiral Funnel");
	if (target.team === "enemy" && funnelCount > 0) {
		const funnelDamage = funnelCount * 2 * stacks;
		pendingDamage += funnelDamage;
		adventure.updateArtifactStat("Spiral Funnel", `Extra ${modifier} Damage`, funnelDamage);
	}
	let blockedDamage = 0;
	if (pendingDamage >= target.protection) {
		pendingDamage -= target.protection;
		blockedDamage = target.protection;
		target.protection = 0;
	} else {
		target.protection -= pendingDamage;
		blockedDamage = pendingDamage;
		pendingDamage = 0;
	}
	target.hp -= pendingDamage;
	const resultLines = [`${target.name} takes ${pendingDamage} ${getApplicationEmojiMarkdown(modifier)} damage${blockedDamage > 0 ? ` (${blockedDamage} blocked)` : ""}!${downedCheck(target, adventure)}`];

	const lifeLine = livesCheck(previousLifeCount, adventure.lives);
	if (lifeLine) {
		resultLines.push(lifeLine);
	}
	return resultLines;
}

/**
 * @param {Combatant} user
 * @param {number} damage
 * @param {Adventure} adventure
 */
function payHP(user, damage, adventure) {
	const previousLifeCount = adventure.lives;
	user.hp -= damage;
	let resultText = `${user.name} pays ${damage} HP.${downedCheck(user, adventure)}`;
	const lifeLine = livesCheck(previousLifeCount, adventure.lives);
	if (lifeLine) {
		resultText += ` ${lifeLine}`;
	}
	return resultText;
}

/**
 * @param {Combatant} combatant
 * @param {number} healing
 * @param {Adventure} adventure
 * @param {?string} source
 */
function gainHealth(combatant, healing, adventure, source) {
	combatant.hp += healing;
	const loopholeCount = adventure.getArtifactCount("Health Insurance Loophole");
	let loopholeGold = 0;
	const maxHP = combatant.getMaxHP();
	if (combatant.hp > maxHP) {
		combatant.hp = maxHP;
		if (combatant.team === "delver" && loopholeCount > 0) {
			loopholeGold = (combatant.hp - maxHP) * loopholeCount;
			adventure.gainGold(loopholeGold);
			adventure.updateArtifactStat("Health Insurance Loophole", "Gold Gained", loopholeGold);
		}
	}

	if (combatant.hp === maxHP) {
		return `${combatant.name} was fully healed${loopholeGold > 0 ? ` (${loopholeGold} gold gained)` : ""}${source ? ` from ${source}` : ""}!`;
	} else {
		return `${combatant.name} ${italic(`gained ${healing} HP`)}${source ? ` from ${source}` : ""}.`;
	}
}

/** Checks if adding the modifier inverts exisiting modifiers, increments the (remaining) stacks, then checks if stacks exceed a trigger threshold
 * @param {Combatant[]} combatants
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 */
function addModifier(combatants, { name: modifier, stacks: pendingStacks }) {
	const receipts = [];
	for (const combatant of combatants) {
		const inverse = getInverse(modifier);
		const inverseStacks = combatant.modifiers[inverse];
		if (inverseStacks) {
			removeModifier([combatant], { name: inverse, stacks: pendingStacks });
			if (inverseStacks < pendingStacks) {
				combatant.modifiers[modifier] = pendingStacks - inverseStacks;
			}
		} else {
			if (combatant.modifiers[modifier]) {
				combatant.modifiers[modifier] += pendingStacks;
			} else {
				combatant.modifiers[modifier] = pendingStacks;
			}
		}

		receipts.push(new ModifierReceipt(combatant.name, "add", [getApplicationEmojiMarkdown(modifier)], []));
	}
	return receipts;
}

/** After decrementing a modifier's stacks, delete the modifier's entry in the object
 * @param {Combatant[]} combatants
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 */
function removeModifier(combatants, { name: modifier, stacks }) {
	const receipts = [];
	for (const combatant of combatants) {
		const didHaveModifier = modifier in combatant.modifiers;
		if (isNaN(parseInt(stacks)) || stacks >= combatant.modifiers[modifier]) {
			delete combatant.modifiers[modifier];
		} else if (modifier in combatant.modifiers) {
			combatant.modifiers[modifier] -= stacks;
		}
		if (didHaveModifier) {
			receipts.push(new ModifierReceipt(combatant.name, "remove", [getApplicationEmojiMarkdown(modifier)], []));
		}
	}
	return receipts;
}

/**  Consolidation convention set by game design as "name then modifier set" to minimize the number of lines required to describe all changes to a specific combatant
 * @param {ModifierReceipt[]} receipts
 */
function combineModifierReceipts(receipts) {
	// Consolidate by name
	// eg "Combatant gains X" + "Combatant gains Y" = "Combatant gains XY"
	for (let i = 0; i < receipts.length; i++) {
		const heldReceipt = receipts[i];
		for (let j = i + 1; j < receipts.length; j++) {
			const checkingReceipt = receipts[j];
			if (heldReceipt.type === checkingReceipt.type && areSetContentsCongruent(heldReceipt.combatantNames, checkingReceipt.combatantNames)) {
				heldReceipt.combineModifierSets(checkingReceipt);
				receipts.splice(j, 1);
				j--;
			}
		}
	}

	// Consolidate by modifier sets
	// eg "X gains ModifierSet" + "Y gains ModifierSet" = "X and Y gain ModifierSet"
	for (let i = 0; i < receipts.length; i++) {
		const heldReceipt = receipts[i];
		for (let j = i + 1; j < receipts.length; j++) {
			const checkingReceipt = receipts[j];
			if (heldReceipt.type === checkingReceipt.type && areSetContentsCongruent(heldReceipt.succeeded, checkingReceipt.succeeded)) {
				heldReceipt.combineCombatantNames(checkingReceipt);
				receipts.splice(j, 1);
				j--;
			}
		}
	}
	return receipts;
}

/** @param {ModifierReceipt[]} receipts */
function generateModifierResultLines(receipts) {
	const resultLines = [];
	for (const receipt of receipts) {
		if (receipt.type === "add") {
			const addedFragments = [];
			if (receipt.succeeded.size > 0) {
				if (receipt.combatantNames.size > 1) {
					addedFragments.push(`gain ${[...receipt.succeeded].join("")}`);
				} else {
					addedFragments.push(`gains ${[...receipt.succeeded].join("")}`);
				}
			}

			if (addedFragments.length > 0) {
				resultLines.push(`${listifyEN([...receipt.combatantNames])} ${listifyEN(addedFragments)}.`);
			}
		} else {
			const removedFragments = [];
			if (receipt.succeeded.size > 0) {
				if (receipt.combatantNames.size > 1) {
					removedFragments.push(`lose ${[...receipt.succeeded].join("")}`);
				} else {
					removedFragments.push(`loses ${[...receipt.succeeded].join("")}`);
				}
			}

			if (removedFragments.length > 0) {
				resultLines.push(`${listifyEN([...receipt.combatantNames])} ${listifyEN(removedFragments)}.`);
			}
		}
	}
	return resultLines;
}

/** add Stagger, negative values allowed
 * @param {Combatant[]} combatants
 * @param {Combatant | null} applier
 * @param {number} value
 */
function changeStagger(combatants, applier, value) {
	for (const combatant of combatants) {
		if (!combatant.isStunned) {
			let pendingStagger = value;
			if (applier && pendingStagger > 0) {
				if (applier.getModifierStacks("Impactful") > 0) {
					pendingStagger++;
				}
				if (applier.getModifierStacks("Ineffectual") > 0) {
					pendingStagger--;
				}
			}
			combatant.stagger = Math.min(Math.max(combatant.stagger + pendingStagger, 0), combatant.getPoise());
		}
	}
}

/**
 * @param {Combatant[]} combatants
 * @param {number} value
 */
function addProtection(combatants, value) {
	for (const combatant of combatants) {
		combatant.protection += value;
	}
}

/** Create a string containing the combatant's current modifiers
 * @param {Combatant} combatant
* @param {Adventure} adventure
*/
function modifiersToString(combatant, adventure) {
	let modifiersText = "";
	for (const modifier in combatant.modifiers) {
		modifiersText += `${getApplicationEmojiMarkdown(modifier)} ${bold(`x ${combatant.modifiers[modifier]}`)}: ${getModifierDescription(modifier, combatant.modifiers[modifier], combatant.getPoise(), adventure.getArtifactCount("Spiral Funnel"))}\n`;
	}
	return modifiersText;
}

/** Assembles an array of the combatant's innate and modifier-induced counters
 * @param {Combatant} combatant
 * @returns {("Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Unaligned")[]}
 */
function getCombatantCounters(combatant) {
	const counters = [];
	essenceList().forEach(essence => {
		if (`${essence} Vulnerability` in combatant.modifiers || getCounteredEssences(essence).includes(combatant.essence)) {
			counters.push(essence);
		}
	})
	return counters;
}

/**
 * @param {Combatant[]} targets
 * @param {Combatant[]} team
 * @param {string} modifier
 */
function concatTeamMembersWithModifier(targets, team, modifier) {
	const targetSet = new Set();
	const targetArray = [];
	for (const target of targets) {
		if (target.hp > 0) {
			targetSet.add(target.name);
			targetArray.push(target);
		}
	}
	for (const member of team) {
		if (member.hp > 0 && member.getModifierStacks(modifier) > 0 && !targetSet.has(member.name)) {
			targetSet.add(member.name);
			targetArray.push(member);
		}
	}
	return targetArray;
}

module.exports = {
	dealDamage,
	dealModifierDamage,
	payHP,
	gainHealth,
	addModifier,
	removeModifier,
	combineModifierReceipts,
	generateModifierResultLines,
	changeStagger,
	addProtection,
	modifiersToString,
	getCombatantCounters,
	concatTeamMembersWithModifier
};
