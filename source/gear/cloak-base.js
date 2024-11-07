const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');
const { accuratePassive } = require('./descriptions/passives.js');

module.exports = new GearTemplate("Cloak",
	[
		accuratePassive,
		["use", "Gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Armor",
	"Wind",
	200,
	(targets, user, adventure) => {
		const { element, modifiers: [evade], bonus } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (user.crit) {
			pendingEvade.stacks += bonus;
		}
		return generateModifierResultLines(addModifier([user], pendingEvade));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Accelerating Cloak", "Accurate Cloak", "Evasive Cloak")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setDurability(15);
