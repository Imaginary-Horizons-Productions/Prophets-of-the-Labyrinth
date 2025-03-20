const { GearTemplate, GearFamily, CombatantReference } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { getPetMove } = require('../pets/_petDictionary');
const { rollableHerbs } = require('../shared/herbs');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { listifyEN, joinAsStatement } = require('../util/textUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const herbBasket = new GearTemplate("Herb Basket",
	[
		["use", "Add @{herbCount} random herb to loot"],
		["critical", "Herbs gathered x @{critBonus}"]
	],
	"Adventuring",
	"Earth"
).setCost(200)
	.setEffect(herbBasketEffect, { type: "none", team: "none" })
	.setCooldown(1)
	.setScalings({
		herbCount: 1,
		critBonus: 2
	})
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });

/** @type {typeof herbBasket.effect} */
function herbBasketEffect(targets, user, adventure) {
	const { scalings: { herbCount, critBonus } } = herbBasket;
	let pendingHerbCount = herbCount;
	if (user.crit) {
		pendingHerbCount *= critBonus;
	}
	const randomHerb = rollableHerbs[user.roundRns[`${herbBasket.name}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
	adventure.room.addResource(randomHerb, "Item", "loot", pendingHerbCount);
	if (user.crit) {
		return [`${user.name} gathers a double-batch of ${randomHerb}.`];
	} else {
		return [`${user.name} gathers a batch of ${randomHerb}.`];
	}
}
//#endregion Base

//#region Enticing
const enticingHerbBasket = new GearTemplate("Enticing Herb Basket",
	[
		["use", "Entice an ally's pet to use their first move and add @{herbCount} random herb to loot"],
		["critical", "Herbs gathered x @{critBonus}"]
	],
	"Adventuring",
	"Earth"
).setCost(350)
	.setEffect(enticingHerbBasketEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setScalings({
		herbCount: 1,
		critBonus: 2
	})
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });

/** @type {typeof enticingHerbBasket.effect} */
function enticingHerbBasketEffect([target], user, adventure) {
	const { scalings: { herbCount, critBonus }, essence } = enticingHerbBasket;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const randomHerb = rollableHerbs[user.roundRns[`${enticingHerbBasket.name}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
	const resultLines = [];
	if (user.crit) {
		adventure.room.addResource(randomHerb, "Item", "loot", herbCount * critBonus);
		resultLines.push(`${user.name} gathers a double-batch of ${randomHerb}.`);
	} else {
		adventure.room.addResource(randomHerb, "Item", "loot", herbCount);
		resultLines.push(`${user.name} gathers a batch of ${randomHerb}.`);
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
		resultLines.push(`${target.name}'s ${owner.pet.type} uses ${petMoveTemplate.name}`, ...petMoveTemplate.effect(petMoveTemplate.selector(owner, petRNs).map(reference => adventure.getCombatant(reference)), owner, adventure, { petRNs }));
	}
	return resultLines;
}
//#endregion Enticing

//#region Guarding
const guardingHerbBasket = new GearTemplate("Guarding Herb Basket",
	[
		["use", "Grant an ally <@{protection}> protection and add @{herbCount} random herb to loot"],
		["critical", "Herbs gathered x @{critBonus}"]
	],
	"Adventuring",
	"Earth"
).setCost(350)
	.setEffect(guardingHerbBasketEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setScalings({
		herbCount: 1,
		critBonus: 2,
		protection: protectionScalingGenerator(50)
	})
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });

/** @type {typeof guardingHerbBasket.effect} */
function guardingHerbBasketEffect(targets, user, adventure) {
	const { scalings: { herbCount, critBonus, protection }, essence } = guardingHerbBasket;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const randomHerb = rollableHerbs[user.roundRns[`${guardingHerbBasket.name}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
	const resultLines = [];
	if (user.crit) {
		adventure.room.addResource(randomHerb, "Item", "loot", herbCount * critBonus);
		resultLines.push(`${user.name} gathers a double-batch of ${randomHerb}.`);
	} else {
		adventure.room.addResource(randomHerb, "Item", "loot", herbCount);
		resultLines.push(`${user.name} gathers a batch of ${randomHerb}.`);
	}
	resultLines.push(joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."));
	addProtection(targets, protection.calculate(user));
	return resultLines;
}
//#endregion Guarding

module.exports = new GearFamily(herbBasket, [enticingHerbBasket, guardingHerbBasket], false);
