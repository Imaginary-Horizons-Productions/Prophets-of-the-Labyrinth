const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

const bounces = 3;
module.exports = new GearTemplate("Heat Weaken",
	[
		["use", "Inflict @{mod0Stacks} @{mod0} on @{bounces} random foes"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [frailty], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingFrailty = { ...frailty };
		if (user.crit) {
			pendingFrailty.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingFrailty)));
	}, { type: `random${SAFE_DELIMITER}${bounces}`, team: "foe" })
	.setUpgrades("Numbing Heat Weaken", "Staggering Heat Weaken")
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 })
	.setScalings({ critBonus: 2, bounces })
	.setRnConfig({ foes: bounces });
