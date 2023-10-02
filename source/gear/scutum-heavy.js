const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Heavy Scutum",
	"Grant @{block} block to an ally and yourself",
	"Block x@{critBonus}",
	"Armor",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		addBlock(user, block);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${user.getName(adventure.room.enemyIdMap)}.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Sweeping Scutum", "Vigilant Scutum")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setBlock(100);
