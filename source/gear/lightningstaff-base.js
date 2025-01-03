const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

const bounceCount = 3;
module.exports = new GearTemplate("Lightning Staff",
	[
		["use", `Strike ${bounceCount} random foes for @{damage} @{essence} damage`],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Adventuring",
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
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "foe" })
	.setUpgrades("Disenchanting Lightning Staff", "Hexing Lightning Staff")
	.setCooldown(2)
	.setRnConfig({ foes: 3 });
