const { GearTemplate, GearFamily } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

//#region Base
const greatsword = new GearTemplate("Greatsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and their adjacent allies"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Wind"
).setCost(200)
	.setEffect(greatswordEffect, { type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});

/** @type {typeof greatsword.effect} */
function greatswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = greatsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines;
}
//#endregion Base

//#region Chaining
const chainingGreatsword = new GearTemplate("Chaining Greatsword",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and their adjacent allies"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Wind"
).setCost(350)
	.setEffect(chainingGreatswordEffect, { type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	});

/** @type {typeof chainingGreatsword.effect} */
function chainingGreatswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus } } = chainingGreatsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines;
}
//#endregion Chaining

//#region Distracting
const distractingGreatsword = new GearTemplate("Distracting Greatsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe and their adjacent allies"],
		["critical", "Damage x @{critBonus}"]
	],
	"Offense",
	"Wind"
).setCost(350)
	.setEffect(distractingGreatswordEffect, { type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setCooldown(2)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 2 });

/** @type {typeof distractingGreatsword.effect} */
function distractingGreatswordEffect(targets, user, adventure) {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction] } = distractingGreatsword;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(survivors, distraction))));
}
//#endregion Distracting

module.exports = new GearFamily(greatsword, [chainingGreatsword, distractingGreatsword], false);
