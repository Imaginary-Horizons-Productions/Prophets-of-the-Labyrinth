const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Midas Staff",
	"Apply @{mod0Stacks} @{mod0} to a combatant, then gain @{mod1Stacks} @{mod1}",
	"@{mod0} +@{bonus}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [curse, quicken], bonus } = module.exports;
		const pendingCurse = { ...curse, stacks: curse.stacks + (isCrit ? bonus : 0) };
		if (user.element === element) {
			if (target.team === user.team) {
				target.addStagger("elementMatchAlly");
			} else {
				target.addStagger("elementMatchFoe");
			}
		}
		addModifier(target, pendingCurse);
		addModifier(user, quicken);
		return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas. ${user.getName(adventure.room.enemyIdMap)} is Quickened.`;
	}
).setTargetingTags({ target: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
