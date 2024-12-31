const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Chaining Greatsword",
	[
		["use", "Deal @{damage} @{essence} damage to a foe and their adjacent allies"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe" })
	.setSidegrades("Distracting Greatsword")
	.setCooldown(1)
	.setDamage(40);
