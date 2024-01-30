const { GearTemplate } = require('../classes');
const { listifyEN } = require('../util/textUtil');

const rollableHerbs = [
	"Panacea",
	"Quick Pepper",
	"Regen Root",
	"Strength Spinach"
];

module.exports = new GearTemplate("Organic Herb Basket",
	"Add @{bonus} random herb to loot, regain 1 durability when entering a new room",
	"Herbs gathered x@{critMultiplier}",
	"Trinket",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, critMultiplier } = module.exports;
		let pendingHerbCount = bonus;
		if (isCrit) {
			pendingHerbCount *= critMultiplier;
		}
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		const randomHerb = rollableHerbs[adventure.generateRandomNumber(rollableHerbs.length, "battle")];
		adventure.addResource(randomHerb, "item", "loot", pendingHerbCount);
		if (isCrit) {
			return `${user.getName(adventure.room.enemyIdMap)} gathers a double-batch of ${randomHerb}.`;
		} else {
			return `${user.getName(adventure.room.enemyIdMap)} gathers a batch of ${randomHerb}.`;
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Reinforced Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setDurability(15)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) });
