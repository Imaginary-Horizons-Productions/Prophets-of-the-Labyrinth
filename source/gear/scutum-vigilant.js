const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Vigilant Scutum",
	"Grant @{block} block to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Block x@{critBonus}",
	"Armor",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [vigilance], block, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		addBlock(user, block);
		addModifier(user, vigilance);
		const userName = user.getName(adventure.room.enemyIdMap);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${userName}. ${userName} gains Vigilance.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Guarding Scutum", "Sweeping Scutum")
	.setModifiers({ name: "Vigilance", stacks: 1 })
	.setDurability(15)
	.setBlock(75);
