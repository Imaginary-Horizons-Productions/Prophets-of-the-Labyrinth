const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Slowing Warhammer",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if foe is stunned> @{essence} damage and inflict @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [slow], damage, bonus, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (target.isStunned) {
			pendingDamage += bonus;
		}
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([target], slow)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Unstoppable Warhammer", "Vigorous Warhammer")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // damage
