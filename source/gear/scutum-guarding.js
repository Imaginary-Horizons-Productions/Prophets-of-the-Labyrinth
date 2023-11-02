const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Guarding Scutum",
	"Grant @{block} block to an ally and @{bonus} block to yourself",
	"Block x@{critBonus}",
	"Armor",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, block, bonus, critBonus } = module.exports;
		let selfBlock = bonus;
		let targetBlock = block;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			selfBlock *= critBonus;
			targetBlock *= critBonus;
		}
		addBlock(target, targetBlock);
		addBlock(user, selfBlock);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)}.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(100)
	.setBonus(75);
