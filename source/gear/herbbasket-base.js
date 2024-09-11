const { GearTemplate } = require('../classes');
const { changeStagger, getNames } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

const rollableHerbs = [
	"Panacea",
	"Quick Pepper",
	"Regen Root",
	"Strength Spinach"
];

module.exports = new GearTemplate("Herb Basket",
	[
		["use", "Add @{bonus} random herb to loot"],
		["Critical💥", "Herbs gathered x@{critMultiplier}"]
	],
	"Trinket",
	"Earth",
	200,
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
			return `${getNames([user], adventure)[0]} gathers a double-batch of ${randomHerb}.`;
		} else {
			return `${getNames([user], adventure)[0]} gathers a batch of ${randomHerb}.`;
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Organic Herb Basket", "Reinforced Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setDurability(15)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) });
