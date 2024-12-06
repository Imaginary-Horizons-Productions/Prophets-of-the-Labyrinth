const { GearTemplate } = require('../classes/index.js');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Vigorous Warhammer",
	[
		["use", "Strike a foe for <@{damage} + @{bonus} if foe is stunned> @{element} damage and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Earth",
	350,
	([target], user, adventure) => {
		const { element, damage, bonus, critMultiplier, modifiers: [impactful] } = module.exports;
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
		return dealDamage([target], user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(addModifier([user], impactful)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Slowing Warhammer", "Unstoppable Warhammer")
	.setModifiers({ name: "Impactful", stacks: 2 })
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // Awesome damage
