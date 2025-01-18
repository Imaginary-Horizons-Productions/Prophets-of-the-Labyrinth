const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Encouragement",
	[
		["use", "Grant an ally <@{mod0Stacks}> @{mod0} and <@{mod1Stacks}> @{mod1}"],
		["Critical💥", "@{mod0} and @{mod1} x @{critBonus}"]
	],
	"Spell",
	"Light"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [excellence, empowerment], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingExcellence = { name: excellence.name, stacks: excellence.stacks.calculate(user) };
		const pendingEmpowerment = { name: empowerment.name, stacks: empowerment.stacks.calculate(user) };
		if (user.crit) {
			pendingExcellence.stacks *= critBonus;
			pendingEmpowerment.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingExcellence).concat(addModifier(targets, pendingEmpowerment))));
	}, { type: "single", team: "ally" })
	.setUpgrades("Rallying Encouragement", "Vigorous Encouragement")
	.setCharges(15)
	.setModifiers({
		name: "Excellence", stacks: {
			description: "2 + 10% Bonus Speed",
			calculate: (user) => 2 + Math.floor(user.getBonusSpeed() / 10)
		}
	}, {
		name: "Empowerment", stacks: {
			description: "25 + Bonus Speed",
			calculate: (user) => 25 + user.getBonusSpeed()
		}
	})
	.setScalings({ critBonus: 2 });
