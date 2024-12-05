const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { accuratePassive } = require('./descriptions/passives.js');

module.exports = new GearTemplate("Accelerating Cloak",
	[
		accuratePassive,
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} +@{bonus} and @{mod1} +@{bonus}"]
	],
	"Armor",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [evade, quicken], bonus } = module.exports;
		const pendingEvade = { ...evade };
		const pendingQuicken = { ...quicken };
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingEvade.stacks += bonus;
			pendingQuicken.stacks += bonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvade).concat(addModifier([user], pendingQuicken))));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Accurate Cloak", "Evasive Cloak")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Quicken", stacks: 1 })
	.setBonus(1) // Evade stacks
	.setCritRate(5)
	.setCooldown(1);
