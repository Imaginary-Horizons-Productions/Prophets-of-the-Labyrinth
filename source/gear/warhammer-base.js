const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Warhammer",
	[
		["use", "Deal <@{damage} + @{bonus} if target is Stunned> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Offense",
	"Darkness",
	200,
	(targets, user, adventure) => {
		const { essence, damage, bonus, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (targets[0].isStunned) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Fatiguing Warhammer", "Toxic Warhammer")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // Reactive Damage
