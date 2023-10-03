const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Discounted Midas Staff",
	"Apply @{mod1Stacks} @{mod1} to a combatant",
	"@{mod1} +@{bonus}",
	"Trinket",
	"Water",
	100,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, curse], bonus } = module.exports;
		const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		addModifier(target, pendingCurse);
		return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas.`;
	})
).setTargetingTags({ target: "single", team: "any" })
	.setSidegrades("Accelerating Midas Staff", "Soothing Midas Staff")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Curse of Midas", stacks: 1 }])
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
