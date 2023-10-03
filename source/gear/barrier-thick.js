const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thick Barrier",
	"Grant an ally @{block} block",
	"Block x@{critBonus}",
	"Spell",
	"Light",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)}.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Purifiying Barrier", "Urgent Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(10)
	.setBlock(1000);