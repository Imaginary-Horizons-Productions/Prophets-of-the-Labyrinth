const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Awesome Morning Star",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if foe is stunned> @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	([target], user, adventure) => {
		const { element, stagger, damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = stagger;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger([target], user, pendingStagger);
		return [...dealDamage([target], user, pendingDamage, false, element, adventure), `${target.name} is Staggered.`];
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Bashing Morning Star", "Hunter's Morning Star")
	.setStagger(2)
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75);
