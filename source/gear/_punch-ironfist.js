const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Iron Fist Punch",
	[
		["use", "Strike a foe for @{damage} @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	0,
	(targets, user, adventure) => {
		const { damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + (user.getModifierStacks("Iron Fist Stance") * 45);
		changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, user.element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDurability(Infinity)
	.setDamage(0);
