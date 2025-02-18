const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, concatTeamMembersWithModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { tempestuousWrathEmpowerment } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Opportunist's Tempestuous Wrath",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and deal <@{damage}> @{essence} damage to a foe and all foes with @{mod1}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Wind"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, modifiers: [empowerment, targetModifier], scalings: { damage, critBonus } } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.room.enemies : adventure.delvers, targetModifier.name);
		const resultLines = generateModifierResultLines(addModifier([user], { name: empowerment.name, stacks: empowerment.stacks.calculate(user) }));
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines: damageResults, survivors } = dealDamage(allTargets, user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(damageResults, payHP(user, user.modifiers.Empowerment, adventure));
	}, { type: "single", team: "foe" })
	.setSidegrades("Flanking Tempestuous Wrath")
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(tempestuousWrathEmpowerment(), { name: "Distraction", stacks: 0 });
