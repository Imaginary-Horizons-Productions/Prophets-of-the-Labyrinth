const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Scutum",
	"Grant @{block} block to an ally and yourself",
	"Block x@{critBonus}",
	"Armor",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		let { element, block, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		addBlock(user, block);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)}.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Scutum", "Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(75);
