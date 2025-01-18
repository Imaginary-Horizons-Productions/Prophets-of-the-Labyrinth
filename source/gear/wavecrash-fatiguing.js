const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, generateModifierResultLines, dealDamage, changeStagger } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Fatiguing Wave Crash",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a single foe"],
		["Critical💥", "Deal <@{damage}> @{essence} damage"]
	],
	"Adventuring",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [incompatibility, impotence], scalings: { damage } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = generateModifierResultLines(addModifier(targets, incompatibility).concat(addModifier(targets, impotence)));
		if (user.crit) {
			resultLines.push(...dealDamage(targets, user, damage.calculate(user), false, essence, adventure));
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Disenchanting Wave Crash")
	.setCooldown(1)
	.setModifiers({ name: "Incompatibility", stacks: 2 }, { name: "Impotence", stacks: 3 })
	.setScalings({ damage: damageScalingGenerator(40) });
