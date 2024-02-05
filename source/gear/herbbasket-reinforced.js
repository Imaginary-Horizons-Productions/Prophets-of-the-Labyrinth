const { GearTemplate } = require('../classes');
const { listifyEN } = require('../util/textUtil');

const rollableHerbs = [
	"Panacea",
	"Quick Pepper",
	"Regen Root",
	"Strength Spinach"
];

module.exports = new GearTemplate("Reinforced Herb Basket",
	"Gain @{protection} protection and add @{bonus} random herb to loot",
	"Herbs gathered x@{critMultiplier}",
	"Trinket",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, bonus, protection, critMultiplier } = module.exports;
		let pendingHerbCount = bonus;
		if (isCrit) {
			pendingHerbCount *= critMultiplier;
		}
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		user.protection += protection;
		const randomHerb = rollableHerbs[adventure.generateRandomNumber(rollableHerbs.length, "battle")];
		adventure.room.addResource(randomHerb, "item", "loot", pendingHerbCount);
		if (isCrit) {
			return `${user.getName(adventure.room.enemyIdMap)} gains protection and gathers a double-batch of ${randomHerb}.`;
		} else {
			return `${user.getName(adventure.room.enemyIdMap)} gains protection and gathers a batch of ${randomHerb}.`;
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Organic Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setProtection(75)
	.setDurability(15)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) });
