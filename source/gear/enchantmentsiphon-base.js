const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Enchantment Siphon",
	[
		["use", "Remove a foe's protection, gain <@{protection} + removed protection> protection"],
		["critical", "Protection x @{critBonus}"]
	],
	"Defense",
	"Wind"
).setCost(200)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { protection, critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const stolenProtection = target.protection;
		target.protection = 0;
		let pendingProtection = protection.calculate(user) + stolenProtection;
		if (user.crit) {
			pendingProtection *= critBonus;
		}
		addProtection([user], pendingProtection);
		if (stolenProtection > 0) {
			return [`${user.name} steals ${target.name}'s protection.`];
		} else {
			return [`${user.name} gains protection.`];
		}
	}, { type: "single", team: "foe" })
	.setUpgrades("Flanking Enchantment Siphon", "Tormenting Enchantment Siphon")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(0),
		critBonus: 2
	});
