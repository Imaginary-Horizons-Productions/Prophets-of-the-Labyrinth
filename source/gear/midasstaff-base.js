const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Midas Staff",
	"Apply @{mod0Stacks} @{mod0} to a combatant",
	"@{mod0} +@{bonus}",
	"Trinket",
	"Water",
	200,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [curse], bonus } = module.exports;
		const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			if (target.team === user.team) {
				target.addStagger("elementMatchAlly");
			} else {
				target.addStagger("elementMatchFoe");
			}
		}
		addModifier(target, pendingCurse);
		return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas.`;
	}
).setTargetingTags({ target: "single", team: "any", needsLivingTargets: true })
	.setUpgrades("Accelerating Midas Staff", "Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
