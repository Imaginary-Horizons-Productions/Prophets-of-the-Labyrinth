const { italic, bold } = require("discord.js");
const { Combatant, Adventure, Receipt } = require("../classes");
const { getInverse, getModifierDescription } = require("../modifiers/_modifierDictionary");
const { getEmoji, getCounteredEssences, essenceList } = require("./essenceUtil.js");
const { getApplicationEmojiMarkdown } = require("./graphicsUtil.js");
const { listifyEN } = require("./textUtil.js");
const { ZERO_WIDTH_WHITESPACE } = require("../constants");
const { EmbedLimits } = require("@sapphire/discord.js-utilities");

/**
 * @param {Combatant} target
 * @param {Adventure} adventure
 */
function downedCheck(target, adventure) {
	const lines = [];
	if (target.hp <= 0) {
		removeModifier([target], { name: "The Target", stacks: "all" });
		if (target.team === "delver") {
			target.hp = target.getMaxHP();
			adventure.lives = Math.max(adventure.lives - 1, 0);
			lines.push(`${bold(`${target.name} was downed${adventure.lives > 0 ? " and revived" : ""}.`)}${ZERO_WIDTH_WHITESPACE}`); // need ZWW for md format nesting
		} else {
			target.hp = 0;
			lines.push(`${bold(`${target.name} was downed`)}.${ZERO_WIDTH_WHITESPACE}`);
			if ("Cowardice" in target.modifiers) {
				const addBlockerCount = adventure.getArtifactCount("Add Blocker");
				if (addBlockerCount > 0) {
					const singleProtection = 150 * addBlockerCount;
					addProtection(adventure.delvers, singleProtection);
					adventure.updateArtifactStat("Add Blocker", "Protection Gained", singleProtection * adventure.delvers.length);
					lines.push("The Add Blocker grants all delvers protection.");
				}
			}
		}
	}
	return lines;
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
	/** @type {(string | Receipt)[]} */
	const results = [];
	/** @type {Combatant[]} */
	const survivors = [];
	for (const target of targets) {
		if (target.hp > 0) { // Skip if target is downed (necessary for multi-hit moves hitting same target)
			if (!(`${essence} Absorption` in target.modifiers)) {
				if (!("Evasion" in target.modifiers) || isUnblockable) {
					let pendingDamage = damage;
					if ("Exposure" in target.modifiers) {
						pendingDamage *= 1.5;
						removeModifier([target], { name: "Exposure", stacks: 1 });
					}
					const changes = { damageArray: [[null, pendingDamage]] };
					const isCounter = getCombatantCounters(target).includes(essence);
					if (isCounter) {
						const counterDamage = assailant.getEssenceCounterDamage();
						pendingDamage += counterDamage;
						changes.damageArray.push([getEmoji(essence), counterDamage]);
					}
					pendingDamage = Math.ceil(pendingDamage);
					if (!isUnblockable) {
						if (pendingDamage >= target.protection) {
							pendingDamage -= target.protection;
							target.protection = 0;
							changes.blockedDamage = target.protection;
						} else {
							target.protection -= pendingDamage;
							pendingDamage = 0;
							changes.blockedDamage = pendingDamage;
						}
					}
					const damageCap = assailant.getDamageCap();
					if (pendingDamage < damageCap) {
						target.hp -= pendingDamage;
					} else {
						target.hp -= damageCap;
						changes.damageCapApplied = damageCap;
					}
					const receipt = new Receipt([target.name], isCounter ? "!" : ".", changes);
					const downedLines = downedCheck(target, adventure);
					if (downedLines.length < 1 || (target.team === "delver" && adventure.lives > 0)) {
						survivors.push(target);
					}
					results.push(receipt, ...downedLines);
					if (pendingDamage > 0 && "Curse of Midas" in target.modifiers) {
						const midasGold = Math.floor(pendingDamage / 10 * target.modifiers["Curse of Midas"]);
						adventure.room.addResource("Gold", "Currency", "loot", midasGold);
						results.push(`${getApplicationEmojiMarkdown("Curse of Midas")}: Loot +${midasGold}g`)
					}
				} else {
					removeModifier([target], { name: "Evasion", stacks: 1 });
					results.push(`${target.name} evades the attack!`);
					survivors.push(target);
				}
			} else {
				results.push(gainHealth(target, damage, adventure, "Essence Absorption"));
				survivors.push(target);
			}
		}
	}
	const lifeLine = livesCheck(previousLifeCount, adventure.lives);
	if (lifeLine) {
		results.push(lifeLine);
	}
	return { results, survivors };
}

const MODIFIER_DAMAGE_PER_STACK = {
	Poison: 10,
	Misfortune: 15,
	Frailty: 20
};

/** modifier damage doesn't have an essence and doesn't interact with other modifiers (eg Exposure & Curse of Midas)
 * @param {Combatant} target
 * @param {"Poison" | "Frailty" | "Misfortune"} modifier
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
	const changes = { damageArray: [[getApplicationEmojiMarkdown(modifier), pendingDamage]] };
	if (pendingDamage >= target.protection) {
		pendingDamage -= target.protection;
		target.protection = 0;
		changes.blockedDamage = target.protection;
	} else {
		target.protection -= pendingDamage;
		pendingDamage = 0;
		changes.blockedDamage = pendingDamage;
	}
	target.hp -= pendingDamage;
	const receipt = new Receipt([target.name], funnelCount > 0 ? "!" : ".", changes);
	/** @type {(Receipt | string)[]} */
	const results = [receipt, ...downedCheck(target, adventure)];

	const lifeLine = livesCheck(previousLifeCount, adventure.lives);
	if (lifeLine) {
		results.push(lifeLine);
	}
	return results;
}

/**
 * @param {Combatant} user
 * @param {number} damage
 * @param {Adventure} adventure
 */
function payHP(user, damage, adventure) {
	const previousLifeCount = adventure.lives;
	user.hp -= damage;
	const resultLines = [`${user.name} pays ${damage} HP.`, ...downedCheck(user, adventure)];
	const lifeLine = livesCheck(previousLifeCount, adventure.lives);
	if (lifeLine) {
		resultLines.push(lifeLine);
	}
	return resultLines;
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

	/** @type {(string | Receipt)[]} */
	const results = [new Receipt([combatant.name], combatant.hp === maxHP ? "!" : ".", { healingsArray: [source || null, healing] })];
	if (loopholeGold > 0) {
		results.push(`Health Insurance Loophole${loopholeCount === 1 ? "" : "s"} granted ${loopholeGold} gold.`);
	}
	return results;
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

		receipts.push(new Receipt([combatant.name], "!", { addedModifierEmojiArray: [getApplicationEmojiMarkdown(modifier)] }));
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
			receipts.push(new Receipt([combatant.name], "!", { removedModifierEmojiArray: [getApplicationEmojiMarkdown(modifier)] }));
		}
	}
	return receipts;
}

/** add Stagger, negative values allowed
 * @param {Combatant[]} combatants
 * @param {Combatant | null} applier
 * @param {number} value
 */
function changeStagger(combatants, applier, value) {
	if (!Number.isFinite(value)) {
		console.error(new Error(`Non-finite value (${value}) provided to changeStagger()`));
	}
	const receipts = [];
	for (const combatant of combatants) {
		if (!combatant.isStunned) {
			let pendingStagger = value;
			if (applier && pendingStagger > 0) {
				if (applier.getModifierStacks("Impact") > 0) {
					pendingStagger++;
					receipts.push(new Receipt([combatant.name], ".", { bonusStagger: "add" }));
				}
				if (applier.getModifierStacks("Impotence") > 0) {
					pendingStagger--;
					receipts.push(new Receipt([combatant.name], ".", { bonusStagger: "remove" }));
				}
			}
			combatant.stagger = Math.max(combatant.stagger + pendingStagger, 0);
		}
	}
	return receipts;
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
 * @param {number} padding
 */
function modifiersToString(combatant, adventure, padding) {
	// Sort lines ascending by length to add as many lines as possible by culling largest lines first
	const modifierLines = Object.entries(combatant.modifiers).map(([modifier, count]) => ({ name: modifier, count, description: `${getApplicationEmojiMarkdown(modifier)} ${bold(`x ${count}`)}: ${getModifierDescription(modifier, count, combatant.getStaggerCap(), adventure.getArtifactCount("Spiral Funnel"))}\n` })).sort((a, b) => a.description.length - b.description.length);
	const poppedList = [];
	for (let i = modifierLines.length - 1; i >= 0; i--) {
		const andMoreText = poppedList.length === 0 ? "" : `...and ${listifyEN(poppedList.map((modifier) => `${modifier.count} x ${getApplicationEmojiMarkdown(modifier.name)}`), false)}\n`;
		if (padding + modifierLines.reduce((totalLength, current) => totalLength + current.description.length, 0) + andMoreText.length <= EmbedLimits.MaximumFieldValueLength) {
			modifierLines.push({ description: andMoreText });
			break;
		}
		poppedList.push(modifierLines.pop());
	}
	return modifierLines.map(object => object.description).join("");
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
 * @param {"delver" | "enemy"} referenceTeam
 * @param {"ally" | "foe"} relativeTeam
 */
function evaluateAbsoluteTeam(referenceTeam, relativeTeam) {
	return relativeTeam === "ally" ^ referenceTeam === "delver" ? "enemy" : "delver";
}

module.exports = {
	downedCheck,
	dealDamage,
	dealModifierDamage,
	payHP,
	gainHealth,
	addModifier,
	removeModifier,
	changeStagger,
	addProtection,
	modifiersToString,
	getCombatantCounters,
	evaluateAbsoluteTeam
};
