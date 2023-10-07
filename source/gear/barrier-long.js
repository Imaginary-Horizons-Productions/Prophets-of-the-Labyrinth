const { GearTemplate } = require('../classes');
const { addBlock, removeModifier, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Long Barrier",
	"Gain @{block} block and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critBonus}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance, critVigilance], block } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			addModifier(user, vigilance);
		} else {
			addModifier(user, critVigilance);
		}
		addBlock(user, block);
		return `${user.getName(adventure.room.enemyIdMap)} Vigilantly prepares to Block.`;
	}
).setTargetingTags({ target: "self", team: "any" })
	.setSidegrades("Cleansing Barrier", "Devoted Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 2 }, { name: "Vigilance", stacks: 4 }])
	.setDurability(5)
	.setBlock(999);
