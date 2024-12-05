const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Double Firecracker",
	[
		["use", "Strike 6 random foes for @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}6`, team: "foe" })
	.setSidegrades("Midas's Firecracker", "Toxic Firecracker")
	.setCooldown(1)
	.setDamage(2)
	.setRnConfig({ "foes": 6 });
