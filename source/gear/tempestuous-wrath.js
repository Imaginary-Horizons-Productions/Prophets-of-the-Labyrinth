const { GearTemplate, GearFamily, Scaling } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, payHP, changeStagger, addModifier, concatTeamMembersWithModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

/** @type {(variantName: string) => ({ name: "Empowerment", stacks: Scaling })} */
function tempestuousWrathEmpowerment() {
	return {
		name: "Empowerment",
		stacks: {
			description: "25 x (1 to 1.5 based on missing HP)",
			calculate: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return 25 * furiousness;
			}
		}
	};
}

//#region Base
const tempestuousWrath = new GearTemplate("Tempestuous Wrath",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Wind"
).setCost(200)
	.setEffect(tempestuousWrathEffect, { type: "single", team: "foe" })
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(tempestuousWrathEmpowerment());

/** @type {typeof tempestuousWrath.effect} */
function tempestuousWrathEffect(targets, user, adventure) {
	const { essence, modifiers: [empowerment], scalings: { damage, critBonus } } = tempestuousWrath;
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
}
//#endregion Base

//#region Flanking
const flankingTempestuousWrath = new GearTemplate("Flanking Tempestuous Wrath",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Wind"
).setCost(350)
	.setEffect(flankingTempestuousWrathEffect, { type: "single", team: "foe" })
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(tempestuousWrathEmpowerment(), { name: "Exposure", stacks: 2 });

/** @type {typeof flankingTempestuousWrath.effect} */
function flankingTempestuousWrathEffect(targets, user, adventure) {
	const { essence, modifiers: [empowerment, exposure], scalings: { damage, critBonus } } = flankingTempestuousWrath;
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
}
//#endregion Flanking

//#region Opportunist's
const opportunistsTempestuousWrath = new GearTemplate("Opportunist's Tempestuous Wrath",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and deal <@{damage}> @{essence} damage to a foe and all foes with @{mod1}"],
		["critical", "Damage x @{critBonus}"]
	],
	"Pact",
	"Wind"
).setCost(350)
	.setEffect(opportunistsTempestuousWrathEffect, { type: "single", team: "foe" })
	.setPactCost([0, "(Empowerment stacks) HP after move"])
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers(tempestuousWrathEmpowerment(), { name: "Distraction", stacks: 0 });

/** @type {typeof opportunistsTempestuousWrath.effect} */
function opportunistsTempestuousWrathEffect(targets, user, adventure) {
	const { essence, modifiers: [empowerment, targetModifier], scalings: { damage, critBonus } } = opportunistsTempestuousWrath;
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
}
//#endregion Opportunist's

module.exports = new GearFamily(tempestuousWrath, [flankingTempestuousWrath, opportunistsTempestuousWrath], false);
