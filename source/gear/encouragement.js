const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, concatTeamMembersWithModifier } = require('../util/combatantUtil');
const { scalingExcellence, scalingEmpowerment } = require('./shared/modifiers');

//#region Base
const encouragement = new GearTemplate("Encouragement",
	[
		["use", "Grant an ally <@{mod0Stacks}> @{mod0} and <@{mod1Stacks}> @{mod1}"],
		["critical", "@{mod0} and @{mod1} x @{critBonus}"]
	],
	"Spell",
	"Light"
).setCost(200)
	.setEffect(encouragementEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setModifiers(scalingExcellence(2), scalingEmpowerment(25))
	.setScalings({ critBonus: 2 });

/** @type {typeof encouragement.effect} */
function encouragementEffect(targets, user, adventure) {
	const { essence, modifiers: [excellence, empowerment], scalings: { critBonus } } = encouragement;
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
}
//#endregion Base

//#region Rallying
const rallyingEncouragement = new GearTemplate("Rallying Encouragement",
	[
		["use", "Grant <@{mod0Stacks}> @{mod0} and <@{mod1Stacks}> @{mod1} to an ally and all allies with @{mod2}"],
		["critical", "@{mod0} and @{mod1} x @{critBonus}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect(rallyingEncouragementEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setModifiers(scalingExcellence(2), scalingEmpowerment(25), { name: "Vigilance", stacks: 0 })
	.setScalings({ critBonus: 2 });

/** @type {typeof rallyingEncouragement.effect} */
function rallyingEncouragementEffect(targets, user, adventure) {
	const { essence, modifiers: [excellence, empowerment, targetModifier], scalings: { critBonus } } = rallyingEncouragement;
	const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
	if (user.essence === essence) {
		changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingExcellence = { name: excellence.name, stacks: excellence.stacks.calculate(user) };
	const pendingEmpowerment = { name: empowerment.name, stacks: empowerment.stacks.calculate(user) };
	if (user.crit) {
		pendingExcellence.stacks *= critBonus;
		pendingEmpowerment.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingExcellence).concat(addModifier(allTargets, pendingEmpowerment))));
}
//#endregion Rallying

//#region Vigorous
const vigorousEncouragement = new GearTemplate("Vigorous Encouragement",
	[
		["use", "Grant an ally <@{mod0Stacks}> @{mod0}, <@{mod1Stacks}> @{mod1}, and @{mod2Stacks} @{mod2}"],
		["critical", "@{mod0} and @{mod1} x @{critBonus}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect(vigorousEncouragementEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setModifiers(scalingExcellence(2), scalingEmpowerment(25), { name: "Impact", stacks: 2 })
	.setScalings({ critBonus: 2 });

/** @type {typeof vigorousEncouragement.effect} */
function vigorousEncouragementEffect(targets, user, adventure) {
	const { essence, modifiers: [excellence, empowerment, impact], scalings: { critBonus } } = vigorousEncouragement;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingExcellence = { name: excellence.name, stacks: excellence.stacks.calculate(user) };
	const pendingEmpowerment = { name: empowerment.name, stacks: empowerment.stacks.calculate(user) };
	if (user.crit) {
		pendingExcellence.stacks *= critBonus;
		pendingEmpowerment.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingExcellence).concat(addModifier(targets, pendingEmpowerment), addModifier(targets, impact))));
}
//#endregion Vigorous

module.exports = new GearFamily(encouragement, [rallyingEncouragement, vigorousEncouragement], false);
