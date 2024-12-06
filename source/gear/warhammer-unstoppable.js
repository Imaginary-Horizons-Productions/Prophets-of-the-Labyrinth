const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Unstoppable Warhammer",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if foe is stunned> unblockable @{element} damage, even while Stunned"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Slowing Warhammer", "Vigorous Warhammer")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // damage
