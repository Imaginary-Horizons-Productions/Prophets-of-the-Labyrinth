const { GearTemplate } = require('../classes');
const { changeStagger } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
const { rollableHerbs } = require('../shared/herbs');

const gearName = "Herb Basket";
module.exports = new GearTemplate(gearName,
	[
		["use", "Add @{bonus} random herb to loot"],
		["Critical💥", "Herbs gathered x@{critMultiplier}"]
	],
	"Trinket",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { element, bonus, critMultiplier } = module.exports;
		let pendingHerbCount = bonus;
		if (user.crit) {
			pendingHerbCount *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
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
	.setUpgrades("Chaining Herb Basket", "Reinforced Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setCooldown(1)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
