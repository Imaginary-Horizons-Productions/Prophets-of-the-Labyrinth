const { GearTemplate } = require('../classes');
const { rollableHerbs } = require('../shared/herbs');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Herb Basket",
	[
		["use", "Add @{bonus} random herb to loot"],
		["Critical💥", "Herbs gathered x @{critMultiplier}"]
	],
	"Adventuring",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { critMultiplier } = module.exports;
		let pendingHerbCount = 1;
		if (user.crit) {
			pendingHerbCount *= critMultiplier;
		}
		const randomHerb = rollableHerbs[user.roundRns[`${gearName}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		adventure.room.addResource(randomHerb, "Item", "loot", pendingHerbCount);
		if (user.crit) {
			return [`${user.name} gathers a double-batch of ${randomHerb}.`];
		} else {
			return [`${user.name} gathers a batch of ${randomHerb}.`];
		}
	}
).setTargetingTags({ type: "none", team: "none" })
	.setUpgrades("Enticing Herb Basket", "Guarding Herb Basket")
	.setCooldown(1)
	.setBonus(1)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
