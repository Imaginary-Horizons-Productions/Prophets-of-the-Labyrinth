const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Firecracker",
	[
		["use", "Strike 3 random foes for @{damage} @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe" })
	.setUpgrades("Double Firecracker", "Midas's Firecracker", "Toxic Firecracker")
	.setCooldown(1)
	.setDamage(5)
	.setRnConfig({ "foes": 3 });
