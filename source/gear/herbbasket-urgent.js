const { GearTemplate } = require('../classes');
const { changeStagger } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

const rollableHerbs = [
	"Panacea",
	"Quick Pepper",
	"Regen Root",
	"Strength Spinach"
];

module.exports = new GearTemplate("Urgent Herb Basket",
	[
		["use", "Add @{bonus} random herb to loot with priority"],
		["Critical💥", "Herbs gathered x@{critMultiplier}"]
	],
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
			changeStagger([user], "elementMatchAlly");
		}
		const randomHerb = rollableHerbs[adventure.generateRandomNumber(rollableHerbs.length, "battle")];
		adventure.room.addResource(randomHerb, "item", "loot", pendingHerbCount);
		if (isCrit) {
			return [`${user.name} gathers a double-batch of ${randomHerb}.`];
		} else {
			return [`${user.name} gathers a batch of ${randomHerb}.`];
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Organic Herb Basket", "Reinforced Herb Basket")
	.setBonus(1) // Herb count
	.setPriority(1)
	.setDurability(15)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) });
