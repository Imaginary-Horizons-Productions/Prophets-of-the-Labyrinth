const { GearTemplate, GearFamily } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, dealDamage } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

//#region Base
const spikedShield = new GearTemplate("Spiked Shield",
	[
		["use", "Gain <@{protection}> protection, deal <your protection> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Defense",
	"Darkness"
).setCost(200)
	.setEffect(spikedShieldEffect, { type: "single", team: "foe" })
	.setUpgrades("Furious Spiked Shield", "Reinforced Spiked Shield")
	.setCooldown(2)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	});

/** @type {typeof spikedShield.effect} */
function spikedShieldEffect(targets, user, adventure) {
	const { essence, scalings: { protection, critBonus } } = spikedShield;
	addProtection([user], protection.calculate(user));
	let pendingDamage = user.protection;
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

//#region Furious
const furiousSpikedShield = new GearTemplate("Furious Spiked Shield",
	[
		["use", "Gain <@{protection}> protection, deal <your protection x 1 to 1.5 based on your missing HP> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Defense",
	"Darkness"
).setCost(350)
	.setEffect(furiousSpikedShieldEffect, { type: "single", team: "foe" })
	.setCooldown(2)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	});

/** @type {typeof furiousSpikedShield.effect} */
function furiousSpikedShieldEffect(targets, user, adventure) {
	const { essence, scalings: { protection, critBonus } } = furiousSpikedShield;
	addProtection([user], protection.calculate(user));
	const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
	let pendingDamage = user.protection * furiousness;
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines;
}
//#endregion Furious

//#region Reinforced
const reinforcedSpikedShield = new GearTemplate("Reinforced Spiked Shield",
	[
		["use", "Gain <@{protection}> protection, deal <your protection> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Defense",
	"Darkness"
).setCost(350)
	.setEffect(reinforcedSpikedShieldEffect, { type: "single", team: "foe" })
	.setCooldown(2)
	.setScalings({
		protection: protectionScalingGenerator(150),
		critBonus: 2
	});

function reinforcedSpikedShieldEffect(targets, user, adventure) {
	const { essence, scalings: { protection, critBonus } } = reinforcedSpikedShield;
	addProtection([user], protection.calculate(user));
	let pendingDamage = user.protection;
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines;
}
//#endregion Reinforced

module.exports = new GearFamily(spikedShield, [furiousSpikedShield, reinforcedSpikedShield], false);
