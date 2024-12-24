const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Awesome Morning Star",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if foe is stunned> @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	([target], user, adventure) => {
		const { essence, stagger, damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = stagger;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.essence === essence) {
			pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger([target], user, pendingStagger);
		return [...dealDamage([target], user, pendingDamage, false, essence, adventure), `${target.name} is Staggered.`];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Bashing Morning Star", "Hunter's Morning Star")
	.setStagger(2)
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75);
