const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Guarding Scutum",
	"Grant @{block} block to an ally and @{bonus} block to yourself",
	"Block x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, block, bonus, critMultiplier } = module.exports;
		let selfBlock = bonus;
		let targetBlock = block;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			selfBlock *= critMultiplier;
			targetBlock *= critMultiplier;
		}
		addBlock(target, targetBlock);
		addBlock(user, selfBlock);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)}.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Sweeping Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(100)
	.setBonus(75);
