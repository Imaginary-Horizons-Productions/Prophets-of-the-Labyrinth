const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Spiked Shield",
	[
		["use", "Gain @{protection} protection, deal <your protection> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Defense",
	"Darkness",
	200,
	(targets, user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		addProtection([user], protection + Math.floor(user.getBonusHP() / 5));
		let pendingDamage = user.protection;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Furious Spiked Shield", "Reinforced Spiked Shield")
	.setCooldown(2)
	.setProtection(125);
