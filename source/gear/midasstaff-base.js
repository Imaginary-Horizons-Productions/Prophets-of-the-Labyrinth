const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Midas Staff",
	[
		["use", "Apply @{mod0Stacks} @{mod0} to a combatant"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Trinket",
	"Water",
	200,
	([target], user, adventure) => {
		const { element, modifiers: [curse], bonus } = module.exports;
		const pendingCurse = { ...curse };
		if (user.crit) {
			pendingCurse.stacks += bonus;
		}
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		return generateModifierResultLines(addModifier([target], pendingCurse));
	}
).setTargetingTags({ type: "single", team: "any" })
	.setUpgrades("Accelerating Midas Staff", "Discounted Midas Staff", "Soothing Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 2 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
