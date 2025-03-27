const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');
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
	changeStagger(targets, user, pendingStagger);
	return [joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered.")];
}
//#endregion Base

//#region Flanking
const flankingWarCry = new GearTemplate("Flanking War Cry",
	[
		["use", "Stagger and inflict <@{mod1Stacks}> @{mod1} on a foe and all foes with @{mod0}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness",
).setCost(350)
	.setEffect(flankingWarCryEffect, { type: `single${SAFE_DELIMITER}Distraction`, team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Distraction", stacks: 0 }, scalingExposure(2))
	.setStagger(2)
	.setScalings({ critBonus: 2 });

/** @type {typeof flankingWarCry.effect} */
function flankingWarCryEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { critBonus }, modifiers: [targetModifier, exposure] } = flankingWarCry;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger *= critBonus;
	}
	changeStagger(targets, user, pendingStagger);
	return [joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, { name: exposure.name, stacks: exposure.stacks.calculate(user) }))));
}
//#endregion Flanking

//#region Weakening
const weakeningWarCry = new GearTemplate("Weakening War Cry",
	[
		["use", "Stagger and inflict @{mod1Stacks} @{mod1} on a foe and all foes with @{mod0}"],
		["critical", "Stagger x @{critBonus}"]
	],
	"Support",
	"Darkness"
).setCost(350)
	.setEffect(weakeningWarCryEffect, { type: `single${SAFE_DELIMITER}Distraction`, team: "foe" })
	.setCooldown(1)
	.setModifiers({ name: "Distraction", stacks: 0 }, { name: "Weakness", stacks: 10 })
	.setStagger(2)
	.setScalings({ critBonus: 2 });

/** @type {typeof weakeningWarCry.effect} */
function weakeningWarCryEffect(targets, user, adventure) {
	const { essence, stagger, scalings: { critBonus }, modifiers: [targetModifier, weakness] } = weakeningWarCry;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	if (user.crit) {
		pendingStagger *= critBonus;
	}
	changeStagger(targets, user, pendingStagger);
	return [joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered.")].concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, weakness))));
}
//#endregion Weakening

module.exports = new GearFamily(warCry, [flankingWarCry, weakeningWarCry], false);
