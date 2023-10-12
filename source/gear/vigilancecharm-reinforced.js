const { GearTemplate } = require('../classes');
const { addModifier, removeModifier, addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reinforced Vigilance Charm",
	"Gain @{mod1Stacks} @{mod1} and @{block} block",
	"@{mod1} +@{bonus} and block x@{critBonus}",
	"Trinket",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance], bonus, block, critBonus } = module.exports;
		const pendingVigilance = { ...vigilance, stacks: vigilance.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		addModifier(user, pendingVigilance);
		addBlock(user, block * (isCrit ? critBonus : 1))
		return `${user.getName(adventure.room.enemyIdMap)} gains Vigilance and prepares to Block.`;
	}
).setTargetingTags({ target: "self", team: "self" })
	.setSidegrades("Long Vigilance Charm", "Devoted Vigilance Charm")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 3 })
	.setBonus(2) // Vigilance stacks
	.setBlock(60)
	.setDurability(15);
