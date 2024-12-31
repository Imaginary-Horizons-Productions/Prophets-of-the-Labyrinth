const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

const bounceCount = "3";
module.exports = new GearTemplate("Bouncing Flail",
	[
		["use", `Inflict @{damage} @{essence} damage on ${bounceCount} random foes`],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Earth",
	350,
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
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setSidegrades("Incompatible Flail")
	.setCooldown(1)
	.setDamage(20)
	.setStagger(2);
