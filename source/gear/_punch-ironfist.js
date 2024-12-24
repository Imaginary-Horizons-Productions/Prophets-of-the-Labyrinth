const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Iron Fist Punch",
	[
		["use", "Strike a foe for @{damage} @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Technique",
	"Unaligned",
	0,
	(targets, user, adventure) => {
		const { damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + (user.getModifierStacks("Iron Fist Stance") * 45);
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, user.essence, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0);
