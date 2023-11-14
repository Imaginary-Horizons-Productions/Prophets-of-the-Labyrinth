const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Scutum",
	"Grant @{block} block to an ally and yourself",
	"Block x@{critMultiplier}",
	"Armor",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		let { element, block, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critMultiplier;
		}
		addBlock(target, block);
		addBlock(user, block);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)}.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Scutum", "Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(75);
