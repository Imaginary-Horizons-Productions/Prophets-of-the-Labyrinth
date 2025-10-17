const { GearTemplate, CombatantReference, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { changeStagger, addModifier, addProtection } = require('../util/combatantUtil');
const { scalingRegeneration } = require('./shared/modifiers');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const carrot = new GearTemplate("Carrot",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} to an ally and entice their pet to use its first move"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Earth"
).setCost(200)
	.setEffect(carrotEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setModifiers(scalingRegeneration(2))
	.setScalings({ critBonus: 1 });

/** @type {typeof carrot.effect} */
function carrotEffect([target], user, adventure) {
	const { essence, modifiers: [regeneration], scalings: { critBonus } } = carrot;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingRegeneration = { name: regeneration.name, stacks: regeneration.stacks.calculate(user) };
	if (user.crit) {
		pendingRegeneration.stacks += critBonus;
	}
	const results = addModifier([target], pendingRegeneration);
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
//#endregion

//#region Balanced
const balancedCarrot = new GearTemplate("Balanced Carrot",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1} to an ally and entice their pet to use its first move"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Earth"
).setCost(350)
	.setEffect(balancedCarrotEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setModifiers(scalingRegeneration(2), { name: "Finesse", stacks: 1 })
	.setScalings({ critBonus: 1 });

/** @type {typeof balancedCarrot.effect} */
function balancedCarrotEffect([target], user, adventure) {
	const { essence, modifiers: [regeneration, finesse], scalings: { critBonus } } = balancedCarrot;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingRegeneration = { name: regeneration.name, stacks: regeneration.stacks.calculate(user) };
	if (user.crit) {
		pendingRegeneration.stacks += critBonus;
	}
	const results = addModifier([target], pendingRegeneration).concat(addModifier([target], finesse));
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
//#endregion Balanced

//#region Guarding
const guardingCarrot = new GearTemplate("Guarding Carrot",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} and <@{protection}> protection to an ally and entice their pet to use its first move"],
		["critical", "@{mod0} + @{critBonus}"]
	],
	"Support",
	"Earth"
).setCost(200)
	.setEffect(guardingCarrotEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setModifiers(scalingRegeneration(2))
	.setScalings({
		critBonus: 1,
		protection: protectionScalingGenerator(50)
	});

/** @type {typeof guardingCarrot.effect} */
function guardingCarrotEffect([target], user, adventure) {
	const { essence, modifiers: [regeneration], scalings: { critBonus, protection } } = guardingCarrot;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingRegeneration = { name: regeneration.name, stacks: regeneration.stacks.calculate(user) };
	if (user.crit) {
		pendingRegeneration.stacks += critBonus;
	}
	addProtection([target], protection.calculate(user));
	const results = addModifier([target], pendingRegeneration).concat(`${target.name} gains protection.`);
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
//#endregion Guarding

module.exports = new GearFamily(carrot, [balancedCarrot, guardingCarrot], false);
