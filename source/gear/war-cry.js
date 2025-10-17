const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, addModifier } = require('../util/combatantUtil');
const { scalingExposure } = require('./shared/modifiers');

//#region Base
const warCry = new GearTemplate("War Cry",
	[
		["use", "Stagger a foe and all foes with @{mod0}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness"
).setCost(200)
	.setEffect(warCryEffect, { type: `single${SAFE_DELIMITER}Distraction`, team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Distraction", stacks: 0 })
	.setStagger(2)
	.setScalings({ critBonus: 2 });

/** @type {typeof warCry.effect} */
function warCryEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { critBonus } } = warCry;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger *= critBonus;
	}
	return changeStagger(targets, user, pendingStagger);
}
//#endregion Base

//#region Flanking
const flankingWarCry = new GearTemplate("Flanking War Cry",
	[
		["use", "Stagger and inflict <@{mod0Stacks}> @{mod0} on a foe and all foes with @{mod1}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness",
).setCost(350)
	.setEffect(flankingWarCryEffect, { type: `single${SAFE_DELIMITER}Distraction`, team: "foe" })
	.setCooldown(1)
	.setModifiers(scalingExposure(2), { name: "Distraction", stacks: 0 })
	.setStagger(2)
	.setScalings({ critBonus: 2 });

/** @type {typeof flankingWarCry.effect} */
function flankingWarCryEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { critBonus }, modifiers: [exposure] } = flankingWarCry;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger *= critBonus;
	}
	return changeStagger(targets, user, pendingStagger).concat(addModifier(targets, { name: exposure.name, stacks: exposure.stacks.calculate(user) }));
}
//#endregion Flanking

//#region Weakening
const weakeningWarCry = new GearTemplate("Weakening War Cry",
	[
		["use", "Stagger and inflict @{mod0Stacks} @{mod0} on a foe and all foes with @{mod1}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness"
).setCost(350)
	.setEffect(weakeningWarCryEffect, { type: `single${SAFE_DELIMITER}Distraction`, team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Weakness", stacks: 10 }, { name: "Distraction", stacks: 0 })
	.setStagger(2)
	.setScalings({ critBonus: 2 });

/** @type {typeof weakeningWarCry.effect} */
function weakeningWarCryEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { critBonus }, modifiers: [weakness] } = weakeningWarCry;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger *= critBonus;
	}
	return changeStagger(targets, user, pendingStagger).concat(addModifier(targets, weakness));
}
//#endregion Weakening

module.exports = new GearFamily(warCry, [flankingWarCry, weakeningWarCry], false);
