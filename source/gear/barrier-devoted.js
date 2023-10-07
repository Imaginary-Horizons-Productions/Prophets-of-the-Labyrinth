const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock, removeModifier, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Devoted Barrier",
	"Grant an ally @{block} block and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critBonus}",
	"Spell",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance, critVigilance], block } = module.exports;
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, vigilance);
		} else {
			addModifier(target, critVigilance);
		}
		addBlock(target, block);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)} and they gain Vigilance.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Cleansing Barrier", "Long Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setDurability(5)
	.setBlock(999);
