const { GearTemplate } = require('../classes');
const { changeStagger } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { rollableHerbs } = require('../shared/herbs');

const gearName = "Chaining Herb Basket";
module.exports = new GearTemplate(gearName,
	[
		["use", "Add @{bonus} random herb to loot"],
		["Critical💥", "Herbs gathered x@{critMultiplier}"]
	],
	"Trinket",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, critMultiplier } = module.exports;
		let pendingHerbCount = bonus;
		if (user.crit) {
			pendingHerbCount *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
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
	.setSidegrades("Reinforced Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 })
	.setCooldown(0);
