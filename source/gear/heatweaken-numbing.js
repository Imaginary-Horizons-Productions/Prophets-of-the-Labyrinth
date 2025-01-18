const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Numbing Heat Weaken",
	[
		["use", `Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on ${bounceCount} random foes`],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [frailty, clumsiness], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingFrailty = { ...frailty };
		if (user.crit) {
			pendingFrailty.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingFrailty).concat(addModifier(targets, clumsiness))));
	}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Staggering Heat Weaken")
	.setCharges(15)
	.setModifiers({ name: "Frailty", stacks: 2 }, { name: "Clumsiness", stacks: 1 })
	.setScalings({ critBonus: 2 });
