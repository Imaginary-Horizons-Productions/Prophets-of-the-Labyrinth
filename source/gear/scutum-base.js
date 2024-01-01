const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Scutum",
	"Grant @{block} block to an ally and yourself",
	"Block x@{critMultiplier}",
	"Armor",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, block, critMultiplier } = module.exports;
		let pendingBlock = block;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingBlock *= critMultiplier;
		}
		addBlock(target, pendingBlock);
		addBlock(user, pendingBlock);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)}.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Guarding Scutum", "Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(75);
