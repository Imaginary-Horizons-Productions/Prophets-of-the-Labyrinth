const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { tempestuousWrathEmpowerment } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Flanking Tempestuous Wrath",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Pact",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [empowerment, exposure], scalings: { damage, critBonus } } = module.exports;
		const resultLines = generateModifierResultLines(addModifier([user], { name: empowerment.name, stacks: empowerment.stacks.calculate(user) }));
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(damageResults, generateModifierResultLines(addModifier(survivors, exposure)), payHP(user, user.modifiers.Empowerment, adventure));
	}, { type: "single", team: "foe" })
	.setSidegrades("Opportunist's Tempestuous Wrath")
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(tempestuousWrathEmpowerment(), { name: "Exposure", stacks: 2 });
