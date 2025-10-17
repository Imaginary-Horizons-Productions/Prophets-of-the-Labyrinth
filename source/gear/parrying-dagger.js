const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const parryingDagger = new GearTemplate("Parrying Dagger",
	[
		["use", "Gain <@{protection}> protection and @{mod0Stacks} @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Light"
).setCost(200)
	.setEffect(parryingDaggerEffect, { type: "self", team: "ally" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

/** @type {typeof parryingDagger.effect} */
function parryingDaggerEffect(targets, user, adventure) {
	const { essence, modifiers: [finesse], scalings: { critBonus, protection } } = parryingDagger;
	if (user.essence === essence) {
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingFinesse = { ...finesse };
	if (user.crit) {
		pendingFinesse.stacks *= critBonus;
	}
	addProtection([user], protection.calculate(user));
	return [`${user.name} gains protection.`].concat(addModifier([user], pendingFinesse));
}
//#endregion Base

//#region Devoted
const devotedParryingDagger = new GearTemplate("Devoted Parrying Dagger",
	[
		["use", "Grant an ally <@{protection}> protection and @{mod0Stacks} @{mod0}"],
		["critical", "@{mod0} x @{critBonus}"]
	],
	"Defense",
	"Light"
).setCost(350)
	.setEffect(devotedParryingDaggerEffect, { type: "single", team: "ally" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

/** @type {typeof devotedParryingDagger.effect} */
function devotedParryingDaggerEffect(targets, user, adventure) {
	const { essence, modifiers: [finesse], scalings: { critBonus, protection } } = devotedParryingDagger;
	if (user.essence === essence) {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingFinesse = { ...finesse };
	if (user.crit) {
		pendingFinesse.stacks *= critBonus;
	}
	addProtection(targets, protection.calculate(user));
	return [`${targets[0].name} gains protection.`].concat(addModifier(targets, pendingFinesse));
}
//#endregion Devoted

//#region Hastening
const hasteningParryingDagger = new GearTemplate("Hastening Parrying Dagger",
	[
		["use", "Gain <@{protection}> protection and @{mod0Stacks} @{mod0}"],
		["critical", "@{mod0} x @{critBonus}, reduce your cooldowns by @{cooldownReduction}"]
	],
	"Defense",
	"Light",
	350,
).setEffect(hasteningParryingDaggerEffect, { type: "self", team: "ally" })
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2,
		cooldownReduction: 1
	})
	.setModifiers({ name: "Finesse", stacks: 1 });

/** @type {typeof hasteningParryingDagger.effect} */
function hasteningParryingDaggerEffect(targets, user, adventure) {
	const { essence, modifiers: [finesse], scalings: { critBonus, protection, cooldownReduction } } = hasteningParryingDagger;
	if (user.essence === essence) {
		changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
	}
	const pendingFinesse = { ...finesse };
	let didCooldown = false;
	if (user.crit) {
		pendingFinesse.stacks *= critBonus;
		user.gear?.forEach(gear => {
			if (gear.cooldown > 1) {
				didCooldown = true;
				gear.cooldown -= cooldownReduction;
			}
		})
	}
	addProtection([user], protection.calculate(user));
	if (didCooldown) {
		return [`${user.name} gains protection and hastens their cooldowns.`].concat(addModifier([user], pendingFinesse));
	} else {
		return [`${user.name} gains protection.`].concat(addModifier([user], pendingFinesse));
	}
}
//#endregion Hastening

module.exports = new GearFamily(parryingDagger, [devotedParryingDagger, hasteningParryingDagger], false);
