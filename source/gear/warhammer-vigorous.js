const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Vigorous Warhammer",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if foe is stunned> @{essence} damage and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { essence, damage, bonus, critMultiplier, modifiers: [impact] } = module.exports;
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
		return dealDamage([target], user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([user], impact)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Slowing Warhammer", "Unstoppable Warhammer")
	.setModifiers({ name: "Impact", stacks: 2 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // Awesome damage
