const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addProtection, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Furious Spiked Shield",
	[
		["use", "Gain @{protection} protection, deal <your protection x 1 to 1.5 based on your missing HP> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Defense",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		addProtection([user], protection + Math.floor(user.getBonusHP() / 5));
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		let pendingDamage = user.protection * furiousness;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Reinforced Spiked Shield")
	.setCooldown(2)
	.setProtection(125);
