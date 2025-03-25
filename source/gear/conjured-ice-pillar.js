const { GearTemplate, GearFamily, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');

//#region Base
const conjuredIcePillar = new GearTemplate("Conjured Ice Pillar",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(200)
	.setEffect(conjuredIcePillarEffect, { type: "self", team: "ally" })
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Vigilance", stacks: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof conjuredIcePillar.effect} */
function conjuredIcePillarEffect(targets, user, adventure) {
	const { essence, modifiers: [evasion, vigilance], scalings: { critBonus } } = conjuredIcePillar;
	if (user.essence === essence) {
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
	if (user.crit) {
		pendingEvasion.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvasion).concat(addModifier([user], vigilance))));
}
//#endregion Base

//#region Devoted
const devotedConjuredIcePillar = new GearTemplate("Devoted Conjured Ice Pillar",
	[
		["use", "Grant an ally <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(devotedConjuredIcePillarEffect, { type: "single", team: "ally" })
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Vigilance", stacks: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof devotedConjuredIcePillar.effect} */
function devotedConjuredIcePillarEffect(targets, user, adventure) {
	const { essence, modifiers: [evasion, vigilance], scalings: { critBonus } } = devotedConjuredIcePillar;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
	if (user.crit) {
		pendingEvasion.stacks *= critBonus;
	}
	return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEvasion).concat(addModifier(targets, vigilance))));
}
//#endregion Devoted

//#region Taunting
const tauntingConjuredIcePillar = new GearTemplate("Taunting Conjured Ice Pillar",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1} then intercept your target's later single target move"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(tauntingConjuredIcePillarEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Vigilance", stacks: 1 })
	.setScalings({ critBonus: 2 });

/** @type {typeof tauntingConjuredIcePillar.effect} */
function tauntingConjuredIcePillarEffect([target], user, adventure) {
	const { essence, modifiers: [evasion, vigilance], scalings: { critBonus } } = tauntingConjuredIcePillar;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
	if (user.crit) {
		pendingEvasion.stacks *= critBonus;
	}
	const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvasion).concat(addModifier([user], vigilance))));
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
		targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
		resultLines.push(`${target.name} falls for the provocation.`);
	}
	return resultLines;
}
//#endregion Taunting

module.exports = new GearFamily(conjuredIcePillar, [devotedConjuredIcePillar, tauntingConjuredIcePillar], false);
