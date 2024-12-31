const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Flail",
	[
		["use", "Inflict @{damage} @{essence} damage on a foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier, stagger } = module.exports;
		let pendingStagger = stagger;
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		changeStagger(targets, user, pendingStagger);
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure)
			.concat(joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered."));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Bouncing Flail", "Incompatible Flail")
	.setCooldown(1)
	.setDamage(40)
	.setStagger(2);
