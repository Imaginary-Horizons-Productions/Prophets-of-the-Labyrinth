const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, dealDamage } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Spiked Shield",
	[
		["use", "Gain <@{protection}> protection, deal <your protection> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Defense",
	"Darkness"
).setCost(200)
	.setEffect(
		(targets, user, adventure) => {
			const { essence, scalings: { protection, critBonus } } = module.exports;
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
		}, { type: "single", team: "foe" })
	.setUpgrades("Furious Spiked Shield", "Reinforced Spiked Shield")
	.setCooldown(2)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	});
