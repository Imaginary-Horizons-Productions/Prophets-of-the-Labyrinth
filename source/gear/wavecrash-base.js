const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, generateModifierResultLines, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Deal @{damage} @{essence} damage"]
	],
	"Adventuring",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [incompatibility], damage } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = generateModifierResultLines(addModifier(targets, incompatibility));
		if (user.crit) {
			resultLines.push(...dealDamage(targets, user, damage + user.getPower(), false, essence, adventure));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Disenchanting Wave Crash", "Fatiguing Wave Crash")
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 })
	.setDamage(40);
