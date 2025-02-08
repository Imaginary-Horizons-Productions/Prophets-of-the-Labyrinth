const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { tempestuousWrathEmpowerment } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Tempestuous Wrath",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Wind"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [empowerment], scalings: { damage, critBonus } } = module.exports;
		const resultLines = generateModifierResultLines(addModifier([user], { name: empowerment.name, stacks: empowerment.stacks.calculate(user) }));
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(damageResults, payHP(user, user.modifiers.Empowerment, adventure));
	}, { type: "single", team: "foe" })
	.setUpgrades("Flanking Tempestuous Wrath", "Opportunist's Tempestuous Wrath")
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(tempestuousWrathEmpowerment());
