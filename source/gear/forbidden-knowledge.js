const { GearTemplate, GearFamily, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { scalingRegeneration } = require('./shared/modifiers');

//#region Base
const forbiddenKnowledge = new GearTemplate("Forbidden Knowledge",
	[
		["use", "Grant an ally @{levelUps} extra level up after combat"],
		["critical", "Reduce your target's cooldowns by @{cooldownReduction}"]
	],
	"Pact",
	"Light"
).setCost(200)
	.setEffect(forbiddenKnowledgeEffect, { type: "single", team: "ally" })
	.setPactCost([2, "Consume @{pactCost} morale"])
	.setScalings({
		levelUps: 1,
		cooldownReduction: 1
	});

/** @type {typeof forbiddenKnowledge.effect} */
function forbiddenKnowledgeEffect([target], user, adventure) {
	const { essence, pactCost, scalings: { levelUps, cooldownReduction } } = forbiddenKnowledge;
	if (user.team === "delver") {
		if (adventure.room.morale < pactCost[0]) {
			return ["...but the party didn't have enough morale to pull it off."];
		}
		adventure.room.morale -= pactCost[0];
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(target)}`, "levelsGained", "loot", levelUps);
	}
	const results = [`${target.name} gains a level's worth of cursed knowledge. The party's morale falls.`];
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	if (user.crit) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name}'s cooldowns were hastened.`);
		}
	}
	return results;
}
//#endregion Base

//#region Enticing
const enticingForbiddenKnowledge = new GearTemplate("Enticing Forbidden Knowledge",
	[
		["use", "Grant an ally @{levelUps} extra level up after combat and entice their pet to use its first move"],
		["critical", "Reduce your target's cooldowns by @{cooldownReduction}"]
	],
	"Pact",
	"Light"
).setCost(350)
	.setEffect(enticingForbiddenKnowledgeEffect, { type: "single", team: "ally" })
	.setPactCost([2, "Consume @{pactCost} morale"])
	.setScalings({
		levelUps: 1,
		cooldownReduction: 1
	});

/** @type {typeof enticingForbiddenKnowledge.effect} */
function enticingForbiddenKnowledgeEffect([target], user, adventure) {
	const { essence, pactCost, scalings: { levelUps, cooldownReduction } } = enticingForbiddenKnowledge;
	if (user.team === "delver") {
		if (adventure.room.morale < pactCost[0]) {
			return ["...but the party didn't have enough morale to pull it off."];
		}
		adventure.room.morale -= pactCost[0];
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(target)}`, "levelsGained", "loot", levelUps);
	}
	const results = [`${target.name} gains a level's worth of cursed knowledge. The party's morale falls.`];
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	if (user.crit) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name}'s cooldowns were hastened.`);
		}
	}
	const ownerIndex = adventure.getCombatantIndex(target);
	const owner = target.team === "delver" ? target : adventure.getCombatant({ team: "delver", index: ownerIndex });
	if (owner.pet?.type) {
		const petMoveTemplate = getPetMove(owner.pet, 0);
		const petRNs = { delverIndex: ownerIndex, moveIndex: 0, targetReferences: [], extras: [] };
		petMoveTemplate.rnConfig.forEach(rnType => {
			switch (rnType) {
				case "enemyIndex":
					const livingEnemyIndices = [];
					for (let i = 0; i < adventure.room.enemies.length; i++) {
						if (adventure.room.enemies[i].hp > 0) {
							livingEnemyIndices.push(i);
						}
					}
					petRNs.targetReferences.push(new CombatantReference(owner.team === "delver" ? "enemy" : "delver", livingEnemyIndices[adventure.generateRandomNumber(livingEnemyIndices.length, "battle")]));
					break;
				default:
					petRNs.extras.push(adventure.generateRandomNumber(rnType, "battle"));
			}
		})
		results.push(`${target.name}'s ${owner.pet.type} uses ${petMoveTemplate.name}`, ...petMoveTemplate.effect(petMoveTemplate.selector(owner, petRNs).map(reference => adventure.getCombatant(reference)), owner, adventure, { petRNs }));
	}
	return results;
}
//#endregion Enticing

//#region Soothing
const soothingForbiddenKnowledge = new GearTemplate("Soothing Forbidden Knowledge",
	[
		["use", "Grant an ally <@{mod0Stacks}> @{mod0} and @{levelUps} extra level up after combat"],
		["critical", "Reduce your target's cooldowns by @{cooldownReduction}"]
	],
	"Pact",
	"Light"
).setCost(350)
	.setEffect(soothingForbiddenKnowledgeEffect, { type: "single", team: "ally" })
	.setPactCost([2, "Consume @{pactCost} morale"])
	.setScalings({
		levelUps: 1,
		cooldownReduction: 1
	})
	.setModifiers(scalingRegeneration(2))

/** @type {typeof soothingForbiddenKnowledge.effect} */
function soothingForbiddenKnowledgeEffect([target], user, adventure) {
	const { essence, pactCost, modifiers: [regeneration], scalings: { levelUps, cooldownReduction } } = soothingForbiddenKnowledge;
	if (user.team === "delver") {
		if (adventure.room.morale < pactCost[0]) {
			return ["...but the party didn't have enough morale to pull it off."];
		}
		adventure.room.morale -= pactCost[0];
		adventure.room.addResource(`levelsGained${SAFE_DELIMITER}${adventure.getCombatantIndex(target)}`, "levelsGained", "loot", levelUps);
	}
	const results = [`${target.name} gains a level's worth of cursed knowledge. The party's morale falls.`];
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	results.push(...addModifier([target], { name: regeneration.name, stacks: regeneration.stacks.calculate(user) }));
	if (user.crit) {
		let didCooldown = false;
		target.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
		if (didCooldown) {
			results.push(`${target.name}'s cooldowns were hastened.`);
		}
	}
	return results;
}
//#endregion Soothing

module.exports = new GearFamily(forbiddenKnowledge, [enticingForbiddenKnowledge, soothingForbiddenKnowledge], false);
