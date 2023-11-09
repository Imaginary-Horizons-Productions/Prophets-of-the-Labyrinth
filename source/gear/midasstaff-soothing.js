const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Midas Staff",
	"Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to a combatant",
	"@{mod0} +@{bonus}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [curse, regen], bonus } = module.exports;
		const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			if (target.team === user.team) {
				target.addStagger("elementMatchAlly");
			} else {
				target.addStagger("elementMatchFoe");
			}
		}
		addModifier(target, pendingCurse);
		addModifier(target, regen);
		return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas and Regen.`;
	}
).setTargetingTags({ target: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Accelerating Midas Staff", "Discounted Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Regen", stacks: 2 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
