const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
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
		const { essence, modifiers: [evasion, swiftness], bonus } = module.exports;
		const pendingEvasion = { ...evasion };
		const pendingSwiftness = { ...swiftness };
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingEvasion.stacks += bonus;
			pendingSwiftness.stacks += bonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvasion).concat(addModifier([user], pendingSwiftness))));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Accurate Cloak", "Evasive Cloak")
	.setModifiers({ name: "Evasion", stacks: 2 }, { name: "Swiftness", stacks: 1 })
	.setBonus(1) // Evasion stacks
	.setCritRate(5)
	.setCooldown(1);
