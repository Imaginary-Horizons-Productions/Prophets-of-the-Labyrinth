const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');

const bounces = 6;
module.exports = new GearTemplate("Double Smokescreen",
	[
		["use", "Grant @{bounces} random allies <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Earth"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [evasion], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEvasion)));
	}, { type: `random${SAFE_DELIMITER}${bounces}`, team: "ally" })
	.setSidegrades("Chaining Smokescreen")
	.setCooldown(1)
	.setRnConfig({ allies: bounces })
	.setModifiers(scalingEvasion(1))
	.setScalings({ critBonus: 2, bounces });
