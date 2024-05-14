const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');

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
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		const addedCurse = addModifier([target], pendingCurse).length > 0;
		if (addedCurse) {
			return `${getNames([target], adventure)[0]} gains Curse of Midas.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setUpgrades("Accelerating Midas Staff", "Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
