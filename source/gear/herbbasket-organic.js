const { GearTemplate } = require('../classes');
const { changeStagger } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');
const { organicPassive } = require('./descriptions/passives');
const { SAFE_DELIMITER } = require('../constants');
const { rollableHerbs } = require('../shared/herbs');

module.exports = new GearTemplate("Organic Herb Basket",
	[
		organicPassive,
		["use", "Add @{bonus} random herb to loot"],
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
		const randomHerb = rollableHerbs[user.roundRns[`Organic Herb Basket${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		adventure.room.addResource(randomHerb, "item", "loot", pendingHerbCount);
		if (isCrit) {
			return [`${user.name} gathers a double-batch of ${randomHerb}.`];
		} else {
			return [`${user.name} gathers a batch of ${randomHerb}.`];
		}
	}
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Reinforced Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setDurability(15)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
