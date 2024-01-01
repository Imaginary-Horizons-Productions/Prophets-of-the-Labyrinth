const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Midas Staff",
	"Apply @{mod0Stacks} @{mod0} to a combatant",
	"@{mod0} +@{bonus}",
	"Trinket",
	"Water",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [curse], bonus } = module.exports;
		const pendingCurse = { ...curse };
		if (isCrit) {
			pendingCurse.stacks += bonus;
		}
		if (user.element === element) {
			if (target.team === user.team) {
				target.addStagger("elementMatchAlly");
			} else {
				target.addStagger("elementMatchFoe");
			}
		}
		const addedCurse = addModifier(target, pendingCurse);
		if (addedCurse) {
			return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ target: "single", team: "any", needsLivingTargets: true })
	.setUpgrades("Accelerating Midas Staff", "Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
