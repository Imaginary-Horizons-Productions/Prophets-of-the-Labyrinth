const { GearTemplate, Move, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');

//#region Base
const shadowOfConfusion = new GearTemplate("Shadow of Confusion",
	[
		["use", "Redirect a slower foe into targeting themself"],
		["critical", "Gain <@{mod0Stacks}> @{mod0}"]
	],
	"Spell",
	"Darkness"
).setCost(200)
	.setEffect(shadowOfConfusionEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingEvasion(2));

/** @type {typeof shadowOfConfusion.effect} */
function shadowOfConfusionEffect([target], user, adventure) {
	const { essence, modifiers: [evade] } = shadowOfConfusion;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const results = [];
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
		targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
		results.push(`${target.name} is redirected into targeting themself.`);
	}
	if (user.crit) {
		results.push(...addModifier([user], { name: evade.name, stacks: evade.stacks.calculate(user) }));
	}
	return results;
}
//#endregion Base

//#region Incompatible
const incompatibleShadowOfConfusion = new GearTemplate("Incompatible Shadow of Confusion",
	[
		["use", "Redirect a slower foe into targeting themself and inflict @{mod1Stacks} @{mod1}"],
		["critical", "Gain <@{mod0Stacks}> @{mod0}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect(incompatibleShadowOfConfusionEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Incompatible", stacks: 3 });

/** @type {typeof incompatibleShadowOfConfusion.effect} */
function incompatibleShadowOfConfusionEffect([target], user, adventure) {
	const { essence, modifiers: [evade, incompatible] } = incompatibleShadowOfConfusion;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const results = [];
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
		targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
		results.push(`${target.name} is redirected into targeting themself.`);
	}
	if (user.crit) {
		results.push(...addModifier([user], { name: evade.name, stacks: evade.stacks.calculate(user) }));
	}
	return results.concat(addModifier([target], incompatible));
}
//#endregion Incompatible

//#region Shattering
const shatteringShadowOfConfusion = new GearTemplate("Shattering Shadow of Confusion",
	[
		["use", "Redirect a slower foe into targeting themself and inflict @{mod1Stacks} @{mod1}"],
		["critical", "Gain <@{mod0Stacks}> @{mod0}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect(shatteringShadowOfConfusionEffect, { type: "single", team: "foe" })
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Frailty", stacks: 3 });

/** @type {typeof shatteringShadowOfConfusion.effect} */
function shatteringShadowOfConfusionEffect([target], user, adventure) {
	const { essence, modifiers: [evade, frailty] } = shatteringShadowOfConfusion;
	if (user.essence === essence) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
	}
	const results = [];
	const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
	const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
	if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
		targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
		results.push(`${target.name} is redirected into targeting themself.`);
	}
	if (user.crit) {
		results.push(...addModifier([user], { name: evade.name, stacks: evade.stacks.calculate(user) }));
	}
	return results.concat(addModifier([target], frailty));
}
//#endregion Shattering

module.exports = new GearFamily(shadowOfConfusion, [incompatibleShadowOfConfusion, shatteringShadowOfConfusion], false);
