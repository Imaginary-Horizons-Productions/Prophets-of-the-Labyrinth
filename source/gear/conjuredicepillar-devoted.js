const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');

module.exports = new GearTemplate("Devoted Conjured Ice Pillar",
	[
		["use", "Grant an ally <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [evasion, vigilance], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEvasion).concat(addModifier(targets, vigilance))));
	}, { type: "single", team: "ally" })
	.setSidegrades("Taunting Conjured Ice Pillar")
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Vigilance", stacks: 1 })
	.setScalings({ critBonus: 2 });
