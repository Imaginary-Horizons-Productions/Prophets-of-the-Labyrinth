const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Greatsword",
	[
		["use", "Deal @{damage} @{essence} damage to a foe and their adjacent allies"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Wind",
	200,
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
	.setUpgrades("Chaining Greatsword", "Distracting Greatsword")
	.setCooldown(2)
	.setDamage(40);
