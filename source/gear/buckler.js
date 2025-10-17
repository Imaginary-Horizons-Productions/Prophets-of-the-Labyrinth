const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const buckler = new GearTemplate("Buckler",
	[
		["use", "Grant an ally <@{protection}> protection and gain @{mod0Stacks} @{mod0}"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Water"
).setCost(200)
	.setEffect(bucklerEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	})
	.setModifiers({ name: "Swiftness", stacks: 3 });

/** @type {typeof buckler.effect} */
function bucklerEffect(targets, user, adventure) {
	const { essence, scalings: { protection, critBonus }, modifiers: [swiftness] } = buckler;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection(targets, pendingProtection);
	return [`${targets[0].name} gains protection.`].concat(addModifier([user], swiftness));
}
//#endregion Base

//#region Guarding
const guardingBuckler = new GearTemplate("Guarding Buckler",
	[
		["use", "Grant an ally <@{protection}> protection and gain @{mod0Stacks} @{mod0}"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Water"
).setCost(350)
	.setEffect(guardingBucklerEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(150),
		critBonus: 2
	})
	.setModifiers({ name: "Swiftness", stacks: 3 });

/** @type {typeof guardingBuckler.effect} */
function guardingBucklerEffect(targets, user, adventure) {
	const { essence, scalings: { protection, critBonus }, modifiers: [swiftness] } = guardingBuckler;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection(targets, pendingProtection);
	return [`${targets[0].name} gains protection.`].concat(addModifier([user], swiftness));
}
//#endregion Guarding

//#region Supportive
const supportiveBuckler = new GearTemplate("Supportive Buckler",
	[
		["use", "Grant an ally <@{protection}> protection, then gain @{mod0Stacks} @{mod0}"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Water"
).setCost(350)
	.setEffect(supportiveBucklerEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setStagger(-2)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	})
	.setModifiers({ name: "Swiftness", stacks: 3 });

/** @type {typeof supportiveBuckler.effect} */
function supportiveBucklerEffect([target], user, adventure) {
	const { essence, stagger, scalings: { protection, critBonus }, modifiers: [swiftness] } = supportiveBuckler;
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_ALLY;
	}
	let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([target], pendingProtection);
	const results = [`${target.name} gains protection.`].concat(addModifier([user], swiftness));
	if (target.stagger > 0) {
		results.push(...changeStagger([target], user, pendingStagger));
	}
	return results;
}
//#endregion Supportive

module.exports = new GearFamily(buckler, [guardingBuckler, supportiveBuckler], false);
