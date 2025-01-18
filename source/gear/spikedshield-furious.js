const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, dealDamage } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Furious Spiked Shield",
	[
		["use", "Gain <@{protection}> protection, deal <your protection x 1 to 1.5 based on your missing HP> @{essence} damage to a foe"],
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
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		let pendingDamage = user.protection * furiousness;
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}, { type: "single", team: "foe" })
	.setSidegrades("Reinforced Spiked Shield")
	.setCooldown(2)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2
	});
