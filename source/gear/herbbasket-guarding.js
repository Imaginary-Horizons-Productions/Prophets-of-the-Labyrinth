const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { rollableHerbs } = require('../shared/herbs');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { listifyEN, joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Guarding Herb Basket",
	[
		["use", "Grant an ally @{protection} protection and add @{bonus} random herb to loot"],
		["Critical💥", "Herbs gathered x @{critMultiplier}"]
	],
	"Adventuring",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { critMultiplier, essence, protection } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const randomHerb = rollableHerbs[user.roundRns[`${gearName}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		const resultLines = [];
		if (user.crit) {
			adventure.room.addResource(randomHerb, "Item", "loot", critMultiplier);
			resultLines.push(`${user.name} gathers a double-batch of ${randomHerb}.`);
		} else {
			adventure.room.addResource(randomHerb, "Item", "loot", 1);
			resultLines.push(`${user.name} gathers a batch of ${randomHerb}.`);
		}
		resultLines.push(joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."));
		addProtection(targets, protection);
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Enticing Herb Basket")
	.setCooldown(1)
	.setBonus(1)
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 })
	.setProtection(50);
