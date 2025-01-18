const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cloak",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Fire"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [evasion], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critBonus;
		}
		return generateModifierResultLines(addModifier([user], pendingEvasion));
	}, { type: "self", team: "ally" })
	.setUpgrades("Accurate Cloak", "Powerful Cloak")
	.setCooldown(1)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + 2% Bonus HP", calculate: (user) => 2 + Math.floor(user.getBonusHP() / 50) } })
	.setScalings({ critBonus: 2 });
