const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, SAFE_DELIMITER } = require('../constants');
const { rollableHerbs } = require('../shared/herbs');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { listifyEN, joinAsStatement } = require('../util/textUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Guarding Herb Basket",
	[
		["use", "Grant an ally <@{protection}> protection and add @{herbCount} random herb to loot"],
		["critical", "Herbs gathered x @{critBonus}"]
	],
	"Adventuring",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { scalings: { herbCount, critBonus, protection }, essence } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const randomHerb = rollableHerbs[user.roundRns[`${module.exports.name}${SAFE_DELIMITER}herbs`][0] % rollableHerbs.length];
		const resultLines = [];
		if (user.crit) {
			adventure.room.addResource(randomHerb, "Item", "loot", herbCount * critBonus);
			resultLines.push(`${user.name} gathers a double-batch of ${randomHerb}.`);
		} else {
			adventure.room.addResource(randomHerb, "Item", "loot", herbCount);
			resultLines.push(`${user.name} gathers a batch of ${randomHerb}.`);
		}
		resultLines.push(joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."));
		addProtection(targets, protection.calculate(user));
		return resultLines;
	}, { type: "single", team: "ally" })
	.setSidegrades("Enticing Herb Basket")
	.setCooldown(1)
	.setScalings({
		herbCount: 1,
		critBonus: 2,
		protection: protectionScalingGenerator(50)
	})
	.setFlavorText({ name: "Possible Herbs", value: listifyEN(rollableHerbs, true) })
	.setRnConfig({ herbs: 1 });
