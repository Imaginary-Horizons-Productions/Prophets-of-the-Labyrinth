const { GearTemplate } = require('../classes');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { rollableHerbs } = require('../shared/herbs');

const gearName = "Reinforced Herb Basket";
module.exports = new GearTemplate(gearName,
	[
		["use", "Gain @{protection} protection and add @{bonus} random herb to loot"],
		["Critical💥", "Herbs gathered x@{critMultiplier}"]
	],
	"Trinket",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, protection, critMultiplier } = module.exports;
		let pendingHerbCount = bonus;
		if (user.crit) {
			pendingHerbCount *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		addProtection([user], protection);
		const randomHerb = rollableHerbs[user.roundRns[`${gearName}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		adventure.room.addResource(randomHerb, "Item", "loot", pendingHerbCount);
		if (user.crit) {
			return [`${user.name} gains protection and gathers a double-batch of ${randomHerb}.`];
		} else {
			return [`${user.name} gains protection and gathers a batch of ${randomHerb}.`];
		}
	}
).setTargetingTags({ type: "none", team: "none" })
	.setSidegrades("Chaining Herb Basket", "Urgent Herb Basket")
	.setBonus(1) // Herb count
	.setProtection(75)
	.setCooldown(1)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
