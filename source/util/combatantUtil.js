const { italic, bold } = require("discord.js");
const { Combatant, Adventure } = require("../classes");
const { getInverse, getModifierDescription, isBuff, isDebuff } = require("../modifiers/_modifierDictionary");
const { getWeaknesses, getResistances, elementsList, getEmoji } = require("./elementUtil.js");
const { getApplicationEmojiMarkdown } = require("./graphicsUtil.js");

/**
 * @param {Combatant} target
 * @param {Adventure} adventure
 */
function downedCheck(target, adventure) {
	if (target.hp <= 0) {
		const targetName = getNames([target], adventure)[0];
		if (target.team === "delver") {
			target.hp = target.getMaxHP();
			adventure.lives = Math.max(adventure.lives - 1, 0);
			return ` ${bold(`${targetName} was downed`)}${adventure.lives > 0 ? " and revived" : ""}.`;
		} else {
			target.hp = 0;
			return ` ${bold(`${targetName} was downed`)}.`;
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
	const targetNames = getNames(targets, adventure);
	targets.forEach((target, index) => {
		if (target.hp > 0) { // Skip if target is downed (necessary for multi-hit moves hitting same target)
			const targetName = targetNames[index];
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
					results.push(`${targetName} takes ${pendingDamage} ${getEmoji(element)} damage${blockedDamage > 0 ? ` (${blockedDamage} was blocked)` : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}${downedCheck(target, adventure)}`);
					if (pendingDamage > 0 && "Curse of Midas" in target.modifiers) {
						const midasGold = pendingDamage / 10;
						adventure.gainGold(Math.floor(midasGold));
						results.push(`Loot: +${midasGold}g`)
					}
				} else {
					removeModifier([target], { name: "Evade", stacks: 1, force: true });
					results.push(`${targetName} evades the attack!`);
				}
			} else {
				results.push(gainHealth(target, damage, adventure, "Elemental Absorption"));
			}
		}
	})
	if (adventure.lives < previousLifeCount) {
		if (adventure.lives > 1) {
			results.push(bold(italic(`${adventure.lives} lives remain.`)) );
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
	const resultLines = [`${bold(getNames([target], adventure)[0])} takes ${pendingDamage} ${getApplicationEmojiMarkdown(modifier)} damage!${downedCheck(target, adventure)}`];

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
	const userName = getNames([user], adventure)[0];
	let resultText = ` ${userName} pays ${damage} HP.${downedCheck(user, adventure)}`;
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
		return `${getNames([combatant], adventure)[0]} was fully healed${loopholeGold > 0 ? ` (${loopholeGold} gold gained)` : ""}${source ? ` from ${source}` : ""}!`;
	} else {
		return `${getNames([combatant], adventure)[0]} ${italic(`gained ${healing} HP`)}${source ? ` from ${source}` : ""}.`;
	}
}

/**
 * @param {Combatant[]} combatants
 * @param {Adventure} adventure
 */
function getNames(combatants, adventure) {
	const generatedNames = [];
	for (const combatant of combatants) {
		if (combatant.team === "enemy" && adventure.room.enemyIdMap[combatant.name] > 1) {
			generatedNames.push(`${combatant.name} ${combatant.id}`);
		} else {
			generatedNames.push(combatant.name);
		}
	}

	return generatedNames;
}

/** Checks if adding the modifier inverts exisiting modifiers, increments the (remaining) stacks, then checks if stacks exceed a trigger threshold
 * @param {Combatant[]} combatants
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Oblivious check
 * @returns {Combatant[]} the affected combatants (as opposed to being prevented by Oblivious)
 */
function addModifier(combatants, { name: modifier, stacks: pendingStacks, force = false }) {
	const affectedCombatants = [];
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

			// Trigger threshold: Progress
			if (combatant.getModifierStacks("Progress") >= 100) {
				combatant.modifiers.Progress = 0;
				addModifier([combatant], { name: "Power Up", stacks: 100, force: false });
			}
			affectedCombatants.push(combatant);
		} else {
			removeModifier([combatant], { name: "Oblivious", stacks: 1, force: true });
		}
	}
	return affectedCombatants;
}

/** After decrementing a modifier's stacks, delete the modifier's entry in the object
 * @param {Combatant[]} combatants
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Stasis check (eg buffs/debuffs consuming themselves)
 * @returns {Combatant[]} if the modifier was decremented (as opposed to being prevented by Stasis)
 */
function removeModifier(combatants, { name: modifier, stacks, force = false }) {
	const affectedCombatants = [];
	for (const combatant of combatants) {
		// Stasis only protects buffs and debuffs
		if (force || !("Stasis" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier)))) {
			const didHaveModifier = modifier in combatant.modifiers;
			if (isNaN(parseInt(stacks)) || stacks >= combatant.modifiers[modifier]) {
				delete combatant.modifiers[modifier];
			} else if (modifier in combatant.modifiers) {
				combatant.modifiers[modifier] -= stacks;
			}
			if (didHaveModifier) {
				affectedCombatants.push(combatant);
			}
		} else {
			removeModifier([combatant], { name: "Stasis", stacks: 1, force: true });
		}
	}
	return affectedCombatants;
}

const ALL_STANCES = ["Iron Fist Stance", "Floating Mist Stance"];

/** Exits all stances aside from the given one, then adds the given stance
 * @param {Combatant} combatant
 * @param {{name: "Iron Fist Stance" | "Floating Mist Stance", stacks: number}} stanceModifier
 */
function enterStance(combatant, stanceModifier) {
	const stancesRemoved = [];
	ALL_STANCES.filter(stanceToCheck => stanceToCheck !== stanceModifier.name).forEach(stanceToRemove => {
		const didRemoveStance = removeModifier([combatant], { name: stanceToRemove, stacks: "all", force: true }).length > 0;
		if (didRemoveStance) {
			stancesRemoved.push(stanceToRemove);
		}
	});
	const didAddStance = addModifier([combatant], stanceModifier).length > 0;
	return { didAddStance, stancesRemoved };
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
	getNames,
	addModifier,
	removeModifier,
	enterStance,
	changeStagger,
	addProtection,
	modifiersToString,
	getCombatantWeaknesses
};
