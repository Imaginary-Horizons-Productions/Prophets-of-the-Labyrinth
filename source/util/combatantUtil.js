const { Combatant, Adventure } = require("../classes");
const { getInverse, isNonStacking, getModifierDescription, isBuff, isDebuff } = require("../modifiers/_modifierDictionary");
const { getWeaknesses, getResistances } = require("./elementUtil.js");

/**
 * @param {Combatant[]} targets
 * @param {Combatant} user
 * @param {number} damage
 * @param {boolean} isUnblockable
 * @param {"Darkness" | "Earth" | "Fire" | "Light" | "Water" | "Wind" | "Untyped" | "Poison"} element
 * @param {Adventure} adventure
 */
async function dealDamage(targets, user, damage, isUnblockable, element, adventure) { //TODO investigate if this still needs to be async (no awaits)
	const previousLifeCount = adventure.lives;
	const resultTexts = [];
	for (const target of targets) {
		const targetName = target.getName(adventure.room.enemyIdMap);
		if (!(`${element} Absorb` in target.modifiers)) {
			if (!("Evade" in target.modifiers) || isUnblockable) {
				const limitBreak = user?.modifiers["Power Up"] || 0;
				let pendingDamage = damage + limitBreak;
				if ("Exposed" in target.modifiers) {
					pendingDamage *= 1.5;
				}
				const isWeakness = getWeaknesses(target.element).includes(element);
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
					if (pendingDamage >= target.block) {
						pendingDamage -= target.block;
						blockedDamage = target.block;
						target.block = 0;
					} else {
						target.block -= pendingDamage;
						blockedDamage = pendingDamage;
						pendingDamage = 0;
					}
				}
				const damageCap = 500 + limitBreak;
				pendingDamage = Math.min(pendingDamage, damageCap);
				target.hp -= pendingDamage;
				let damageText = ` **${targetName}** takes ${pendingDamage} damage${blockedDamage > 0 ? ` (${blockedDamage} was blocked)` : ""}${element === "Poison" ? " from Poison" : ""}${isWeakness ? "!!!" : isResistance ? "." : "!"}`;
				if (element !== "Poison" && "Curse of Midas" in target.modifiers) {
					adventure.gainGold(Math.floor(pendingDamage / 10));
					damageText += ` Gold scatters about the room.`;
				}
				if (target.hp <= 0) {
					if (target.team === "delver") {
						target.hp = target.maxHP;
						adventure.lives = Math.max(adventure.lives - 1, 0);
						damageText += ` *${targetName} has died*${adventure.lives > 0 ? " and been revived" : ""}.`;
					} else {
						target.hp = 0;
						damageText += ` *${targetName} has died*.`;
					}
				}
				resultTexts.push(damageText);
			} else {
				removeModifier(target, { name: "Evade", stacks: 1, force: true });
				resultTexts.push(` ${targetName} evades the attack!`);
			}
		} else {
			resultTexts.push(` ${gainHealth(target, damage, adventure)}`);
		}
	}
	if (adventure.lives < previousLifeCount) { //TODO move this logic into move resolution
		if (adventure.lives === 1) {
			resultTexts.push(`***${adventure.lives} life remains.***`);
		} else {
			resultTexts.push(`***${adventure.lives} lives remain.***`);
		}
	}
	return resultTexts.join(" ");
}

/**
 * @param {Combatant} user
 * @param {number} damage
 * @param {Adventure} adventure
 */
function payHP(user, damage, adventure) {
	user.hp -= damage;
	const userName = user.getName(adventure.room.enemyIdMap);
	let resultText = ` **${userName}** pays ${damage} hp.`;
	if (user.hp <= 0) {
		if (user.team === "delver") {
			user.hp = user.maxHP;
			adventure.lives -= 1;
			if (adventure.lives === 1) {
				resultText += ` *${userName} has died* and been revived. ***${adventure.lives} life remains.***`;
			} else {
				resultText += ` *${userName} has died* and been revived. ***${adventure.lives} lives remain.***`;
			}
		} else {
			user.hp = 0;
			resultText += ` *${userName} has died*.`;
		}
	}
	return resultText;
}

/**
 * @param {Combatant} combatant
 * @param {number} healing
 * @param {Adventure} adventure
 * @param {boolean} inCombat
 */
function gainHealth(combatant, healing, adventure, inCombat = true) {
	combatant.hp += healing;
	let excessHealing = 0;
	const bloodshieldSwordCount = adventure.getArtifactCount("Bloodshield Sword");
	if (combatant.hp > combatant.maxHP) {
		excessHealing = combatant.hp - combatant.maxHP;
		combatant.hp = combatant.maxHP;
		if (combatant.team === "delver" && bloodshieldSwordCount > 0 && inCombat) {
			let convertedBlock = excessHealing * bloodshieldSwordCount;
			addBlock(combatant, convertedBlock);
			adventure.updateArtifactStat("Bloodshield Sword", "Block Gained", convertedBlock);
		}
	}

	if (combatant.hp === combatant.maxHP) {
		return `${combatant.getName(adventure.room.enemyIdMap)} was fully healed${excessHealing && inCombat && bloodshieldSwordCount > 0 ? ` (and gained block)` : ""}!`;
	} else {
		return `${combatant.getName(adventure.room.enemyIdMap)} *gained ${healing} hp*.`
	}
}

/**
 * @param {Combatant} combatant
 * @param {number} integer
 */
function addBlock(combatant, integer) {
	combatant.block += integer;
	return combatant;
}

/** @param {Combatant} combatant */
function clearBlock(combatant) {
	combatant.block = 0;
	return combatant;
}

/** Checks if adding the modifier inverts exisiting modifiers, increments the (remaining) stacks, then checks if stacks exceed a trigger threshold
 * @param {Combatant} combatant
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Oblivious check
 * @returns {boolean} if the modifier was added (as opposed to being prevented by Oblivious)
 */
function addModifier(combatant, { name: modifier, stacks: pendingStacks, force = false }) {
	// Oblivious only blocks buffs and debuffs
	if (force || !("Oblivious" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier)))) {
		const inverse = getInverse(modifier);
		const inverseStacks = combatant.modifiers[inverse];
		if (inverseStacks) {
			removeModifier(combatant, { name: inverse, stacks: pendingStacks, force: true });
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

		// Trigger threshold: Stagger to Stun
		if (combatant.getModifierStacks("Stagger") >= combatant.staggerThreshold) {
			combatant.modifiers.Stagger -= combatant.staggerThreshold;
			combatant.modifiers.Stun = 1;
			if ("Progress" in combatant.modifiers) {
				combatant.modifiers.Progress = Math.ceil(combatant.getModifierStacks("Progress") * 0.8);
			}
		}

		// Trigger threshold: Progress
		if (combatant.getModifierStacks("Progress") >= 100) {
			combatant.modifiers.Progress = 0;
			addModifier(combatant, { name: "Power Up", stacks: 100, force: false });
			addModifier(combatant, { name: "Stasis", stacks: 1, force: false });
		}
		return true;
	} else {
		removeModifier(combatant, { name: "Oblivious", stacks: 1, force: true });
		return false;
	}
}

/** After decrementing a modifier's stacks, delete the modifier's entry in the object
 * @param {Combatant} combatant
 * @param {object} modifierData
 * @param {string} modifierData.name
 * @param {number} modifierData.stacks removes all if not parsable to an integer
 * @param {boolean} modifierData.force whether to ignore the Stasis check (eg buffs/debuffs consuming themselves)
 * @returns {boolean} if the modifier was decremented (as opposed to being prevented by Stasis)
 */
function removeModifier(combatant, { name: modifier, stacks, force = false }) {
	// Stasis only protects buffs and debuffs
	if (force || !("Stasis" in combatant.modifiers && (isBuff(modifier) || isDebuff(modifier)))) {
		if (isNaN(parseInt(stacks)) || stacks >= combatant.modifiers[modifier]) {
			delete combatant.modifiers[modifier];
		} else if (modifier in combatant.modifiers) {
			combatant.modifiers[modifier] -= stacks;
		}
		return true;
	} else {
		removeModifier(combatant, { name: "Stasis", stacks: 1, force: true });
		return false;
	}
}

/** Create a string containing the combatant's current modifiers
 * @param {Combatant} combatant
 * @param {boolean} includeStagger
 * @param {Adventure} adventure
 */
function modifiersToString(combatant, includeStagger, adventure) {
	let modifiersText = "";
	for (const modifier in combatant.modifiers) {
		if (includeStagger || modifier !== "Stagger") {
			modifiersText += `*${modifier}${isNonStacking(modifier) ? "" : ` x ${combatant.modifiers[modifier]}`}* - ${getModifierDescription(modifier, combatant, adventure)}\n`;
		}
	}
	return modifiersText;
}

module.exports = {
	dealDamage,
	payHP,
	gainHealth,
	addBlock,
	clearBlock,
	addModifier,
	removeModifier,
	modifiersToString
};
