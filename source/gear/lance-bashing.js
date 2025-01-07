const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Bashing Lance",
	[
		["use", "Gain @{protection} protection, then deal <@{damage} + protection> @{essence} damage to a single foe"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Action",
	"Water",
	0,
	(targets, user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, user.getPower() + user.protection, false, essence, adventure).concat(`${user.name} gains protection.`);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setProtection(25);
