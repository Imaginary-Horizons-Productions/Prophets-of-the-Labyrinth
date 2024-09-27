const { italic, bold } = require("discord.js");
const { Combatant, Adventure, ModifierReceipt } = require("../classes");
const { getInverse, getModifierDescription, isBuff, isDebuff } = require("../modifiers/_modifierDictionary");
const { getWeaknesses, getResistances, elementsList, getEmoji } = require("./elementUtil.js");
const { getApplicationEmojiMarkdown } = require("./graphicsUtil.js");
const { listifyEN } = require("./textUtil.js");

/**
 * @param {Combatant} target
 * @param {Adventure} adventure
 */
function downedCheck(target, adventure) {
	if (target.hp <= 0) {
		if (target.team === "delver") {
			target.hp = target.getMaxHP();
			adventure.lives = Math.max(adventure.lives - 1, 0);
			return ` ${bold(`${target.name} was downed`)}${adventure.lives > 0 ? " and revived" : ""}.`;
		} else {
			target.hp = 0;
			return ` ${bold(`${target.name} was downed`)}.`;
		}
	} else {
		return "";
	}
}

/**
 * @param {Combatant[]} targets
 * @param {Combatant} assailant
 * @param {number} damage
 * @param {boolean} isUnblockable
 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped"} element
 * @param {Adventure} adventure
 */
function dealDamage(targets, assailant, damage, isUnblockable, element, adventure) {
	const previousLifeCount = adventure.lives;
	const results = [];
	for (const target of targets) {
		if (target.hp > 0) { // Skip if target is downed (necessary for multi-hit moves hitting same target)
			if (!(`${element} Absorb` in target.modifiers)) {
				if (!("Evade" in target.modifiers) || isUnblockable) {
					let pendingDamage = damage;
					if ("Exposed" in target.modifiers) {
						pendingDamage *= 1.5;
						removeModifier([target], { name: "Exposed", stacks: 1, force: true });
					}
					const isWeakness = getCombatantWeaknesses(target).includes(element);
					if (isWeakness) {
						pendingDamage *= 2;
					}
					const isResistance = getResistances(target.element).includes(element);
					if (isResistance) {
						pendingDamage = pendingDamage / 2;
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
					results.push(`${target.name} takes ${pendingDamage} ${getEmoji(element)} damage${blockedDamage > 0 ? ` (${blockedDamage} was blocked)` : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}${downedCheck(target, adventure)}`);
					if (pendingDamage > 0 && "Curse of Midas" in target.modifiers) {
						const midasGold = pendingDamage / 10;
						adventure.gainGold(Math.floor(midasGold));
						results.push(`Loot: +${midasGold}g`)
					}
				} else {
					removeModifier([target], { name: "Evade", stacks: 1, force: true });
					results.push(`${target.name} evades the attack!`);
				}
			} else {
				results.push(gainHealth(target, damage, adventure, "Elemental Absorption"));
			}
		}
	}
	if (adventure.lives < previousLifeCount) {
		if (adventure.lives > 1) {
			results.push(bold(italic(`${adventure.lives} lives remain.`)));
		} else if (adventure.lives === 1) {
			results.push(bold(italic(`${adventure.lives} life remains.`)));
		} else {
			results.push(bold(italic("GAME OVER")));
		}
	}
	return results;
}

const MODIFIER_DAMAGE_PER_STACK = {
	Poison: 10,
	Frail: 20
};

/** modifier damage is unblockable, doesn't have an element, and doesn't interact with other modifiers (eg Exposed & Curse of Midas)
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
		const funnelDamage = funnelCount * 5 * stacks;
		pendingDamage += funnelDamage;
		adventure.updateArtifactStat("Spiral Funnel", `Extra ${modifier} Damage`, funnelDamage);
	}

	target.hp -= pendingDamage;
	const resultLines = [`${bold(target.name)} takes ${pendingDamage} ${getApplicationEmojiMarkdown(modifier)} damage!${downedCheck(target, adventure)}`];

	if (adventure.lives < previousLifeCount) {
		if (adventure.lives > 1) {
			resultLines.push(bold(italic(`${adventure.lives} lives remain.`)));
		} else if (adventure.lives === 1) {
			resultLines.push(bold(italic(`${adventure.lives} life remains.`)));
		} else {
			resultLines.push(bold(italic("GAME OVER")));
		}
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
	let resultText = ` ${user.name} pays ${damage} HP.${downedCheck(user, adventure)}`;
	if (adventure.lives < previousLifeCount) {
		if (adventure.lives > 1) {
			resultText += ` ${bold(italic(`${adventure.lives} lives remain.`))}`;
		} else if (adventure.lives === 1) {
			resultText += ` ${bold(italic(`${adventure.lives} life remains.`))}`;
		} else {
			resultText += ` ${bold(italic("GAME OVER"))}`;
		}
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
 * @param {boolean} modifierData.force whether to ignore the Oblivious check
 */
function addModifier(combatants, { name: modifier, stacks: pendingStacks, force = false }) {
	const receipts = [];
	for (const combatant of combatants) {
		// Oblivious only blocks buffs and debuffs
		if (force || !("Oblivious" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier)))) {
			const inverse = getInverse(modifier);
			const inverseStacks = combatant.modifiers[inverse];
			if (inverseStacks) {
				removeModifier([combatant], { name: inverse, stacks: pendingStacks, force: true });
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
		} else {
			removeModifier([combatant], { name: "Oblivious", stacks: 1, force: true });
			receipts.push(new ModifierReceipt(combatant.name, "add", [], [getApplicationEmojiMarkdown(modifier)]));
		}
	}
	return receipts;
}

/** After decrementing a modifier's stacks, delete the modifier's entry in the object
 * @param {Combatant[]} combatants
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Retain check (eg buffs/debuffs consuming themselves)
 */
function removeModifier(combatants, { name: modifier, stacks, force = false }) {
	const receipts = [];
	for (const combatant of combatants) {
		// Retain only protects buffs and debuffs
		if (force || !("Retain" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier)))) {
			const didHaveModifier = modifier in combatant.modifiers;
			if (isNaN(parseInt(stacks)) || stacks >= combatant.modifiers[modifier]) {
				delete combatant.modifiers[modifier];
			} else if (modifier in combatant.modifiers) {
				combatant.modifiers[modifier] -= stacks;
			}
			if (didHaveModifier) {
				receipts.push(new ModifierReceipt(combatant.name, "remove", [getApplicationEmojiMarkdown(modifier)], []));
			}
		} else {
			removeModifier([combatant], { name: "Retain", stacks: 1, force: true });
			receipts.push(new ModifierReceipt(combatant.name, "remove", [], [getApplicationEmojiMarkdown(modifier)]))
		}
	}
	return receipts;
}

const ALL_STANCES = ["Iron Fist Stance", "Floating Mist Stance"];

/** Exits all stances aside from the given one, then adds the given stance
 * @param {Combatant} combatant
 * @param {{name: "Iron Fist Stance" | "Floating Mist Stance", stacks: number}} stanceModifier
 */
function enterStance(combatant, stanceModifier) {
	const receipts = [];
	ALL_STANCES.filter(stanceToCheck => stanceToCheck !== stanceModifier.name).forEach(stanceToRemove => {
		if (stanceToRemove in combatant.modifiers) {
			receipts.push(...removeModifier([combatant], { name: stanceToRemove, stacks: "all", force: true }));
		}
	});
	return receipts.concat(addModifier([combatant], stanceModifier));
}

/**  Consolidation convention set by game design as "name then modifier set" to minimize the number of lines required to describe all changes to a specific combatant
 * @param {ModifierReceipt[]} receipts
 */
function combineModifierReceipts(receipts) {
	// Consolidate by name
	// eg "Combatant gains X" + "Combatant gains Y" = "Combatant gains XY"
	for (let i = 1; i < receipts.length; i++) {
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
	for (let i = 1; i < receipts.length; i++) {
		const heldReceipt = receipts[i];
		for (let j = i + 1; j < receipts.length; j++) {
			const checkingReceipt = receipts[j];
			if (heldReceipt.type === checkingReceipt.type && areSetContentsCongruent(heldReceipt.succeeded, checkingReceipt.succeeded) && areSetContentsCongruent(heldReceipt.failed, checkingReceipt.failed)) {
				heldReceipt.combineCombatantNames(checkingReceipt);
				receipts.splice(j, 1);
				j--;
			}
		}
	}
	return receipts;
}

/**
 * @param {ModifierReceipt[]} receipts
 */
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
			if (receipt.failed.size > 0) {
				if (receipt.combatantNames.size > 1) {
					addedFragments.push(`were oblivious to ${[...receipt.failed].join("")}`);
				} else {
					addedFragments.push(`was oblivious to ${[...receipt.failed].join("")}`);
				}
			}

			if (addedFragments.length > 0) {
				resultLines.push(`${listifyEN([...receipt.combatantNames])} ${listifyEN(addedFragments)}.`);
			}
		} else {
			const removedFragments = [];
			if (receipt.succeeded.size > 0) {
				if (receipt.combatantNames.size > 1) {
					removedFragments.push(`loses ${[...receipt.succeeded].join("")}`);
				} else {
					removedFragments.push(`lose ${[...receipt.succeeded].join("")}`);
				}
			}
			if (receipt.failed.size > 0) {
				if (receipt.combatantNames.size > 1) {
					removedFragments.push(`retain ${[...receipt.failed].join("")}`);
				} else {
					removedFragments.push(`retains ${[...receipt.failed].join("")}`);
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
 * @param {number | "elementMatchAlly" | "elementMatchFoe"} value
 */
function changeStagger(combatants, value) {
	for (const combatant of combatants) {
		if (!combatant.isStunned) {
			let pendingStagger = value;
			if (value === "elementMatchAlly") {
				pendingStagger = -1;
			} else if (value === "elementMatchFoe") {
				pendingStagger = 2;
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
		modifiersText += `*${modifier} x ${combatant.modifiers[modifier]}* - ${getModifierDescription(modifier, combatant, adventure)}\n`;
	}
	return modifiersText;
}

/** Assembles an array of the combatant's elemental weaknesses and modifier-induced weaknesses
 * @param {Combatant} combatant
 * @returns {("Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped")[]}
 */
function getCombatantWeaknesses(combatant) {
	const weaknesses = [...getWeaknesses(combatant.element)]; // avoid closure by making new array
	elementsList().forEach(element => {
		if (!weaknesses.includes(element) && `${element} Weakness` in combatant.modifiers) {
			weaknesses.push(element);
		}
	})
	return weaknesses;
}

module.exports = {
	dealDamage,
	dealModifierDamage,
	payHP,
	gainHealth,
	addModifier,
	removeModifier,
	enterStance,
	combineModifierReceipts,
	generateModifierResultLines,
	changeStagger,
	addProtection,
	modifiersToString,
	getCombatantWeaknesses
};
