const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Conjured Ice Pillar",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [evasion, vigilance], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critBonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvasion).concat(addModifier([user], vigilance))));
	}, { type: "self", team: "ally" })
	.setUpgrades("Devoted Conjured Ice Pillar", "Taunting Conjured Ice Pillar")
	.setCharges(15)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + 2% Bonus HP", calculate: (user) => 2 + Math.floor(user.getBonusHP() / 50) } }, { name: "Vigilance", stacks: 1 })
	.setScalings({ critBonus: 2 });
