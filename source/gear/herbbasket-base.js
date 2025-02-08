const { GearTemplate } = require('../classes');
const { rollableHerbs } = require('../shared/herbs');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Herb Basket",
	[
		["use", "Add @{herbCount} random herb to loot"],
		["critical", "Herbs gathered x @{critBonus}"]
	],
	"Adventuring",
	"Earth"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { scalings: { herbCount, critBonus } } = module.exports;
		let pendingHerbCount = herbCount;
		if (user.crit) {
			pendingHerbCount *= critBonus;
		}
		const randomHerb = rollableHerbs[user.roundRns[`${gearName}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		adventure.room.addResource(randomHerb, "Item", "loot", pendingHerbCount);
		if (user.crit) {
			return [`${user.name} gathers a double-batch of ${randomHerb}.`];
		} else {
			return [`${user.name} gathers a batch of ${randomHerb}.`];
		}
	}, { type: "none", team: "none" })
	.setUpgrades("Enticing Herb Basket", "Guarding Herb Basket")
	.setCooldown(1)
	.setScalings({
		herbCount: 1,
		critBonus: 2
	})
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
