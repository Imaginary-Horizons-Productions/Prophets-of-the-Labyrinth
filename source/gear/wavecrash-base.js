const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, generateModifierResultLines, dealDamage, changeStagger } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Deal <@{damage}> @{essence} damage"]
	],
	"Adventuring",
	"Water"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [incompatibility], scalings: { damage } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = generateModifierResultLines(addModifier(targets, incompatibility));
		if (user.crit) {
			resultLines.push(...dealDamage(targets, user, damage.calculate(user), false, essence, adventure).resultLines);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Disenchanting Wave Crash", "Fatiguing Wave Crash")
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 })
	.setScalings({ damage: damageScalingGenerator(40) });
