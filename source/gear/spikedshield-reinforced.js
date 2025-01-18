const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, dealDamage } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Reinforced Spiked Shield",
	[
		["use", "Gain <@{protection}> protection, deal <your protection> @{essence} damage to a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Defense",
	"Darkness"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { protection, critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		addProtection([user], protection.calculate(user));
		let pendingDamage = user.protection;
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}, { type: "single", team: "foe" })
	.setSidegrades("Furious Spiked Shield")
	.setCooldown(2)
	.setScalings({
		protection: protectionScalingGenerator(150),
		critBonus: 2
	});
