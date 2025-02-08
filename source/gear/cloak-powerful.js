const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');
const { powerfulPassive } = require('./shared/passiveDescriptions');

module.exports = new GearTemplate("Powerful Cloak",
	[
		powerfulPassive,
		["use", "Gain <@{mod0Stacks}> @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Fire"
).setCost(350)
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
	.setModifiers(scalingEvasion(2))
	.setScalings({
		critBonus: 2,
		percentPower: 10
	});
