const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Sharpened Strong Attack",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Untyped",
	350,
	(targets, user, adventure) => {
		const { damage, element, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Flanking Strong Attack", "Staggering Strong Attack")
	.setCooldown(1)
	.setDamage(90);
