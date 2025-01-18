const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Chaining Smokescreen",
	[
		["use", `Grant ${bounceCount} random allies <@{mod0Stacks}> @{mod0}`],
		["Critical💥", "@{mod0} x @{critBonus}"]
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
	}, { type: `random${SAFE_DELIMITER}${bounceCount}`, team: "ally" })
	.setSidegrades("Double Smokescreen")
	.setCooldown(0)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + 2% Bonus HP", calculate: (user) => 2 + Math.floor(user.getBonusHP() / 50) } })
	.setScalings({ critBonus: 2 });
