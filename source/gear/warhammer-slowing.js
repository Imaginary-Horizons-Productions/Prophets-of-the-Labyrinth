const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Slowing Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is currently stunned) @{element} damage and inflict @{mod0Stacks} @{mod0}",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [slow], damage, bonus, critBonus } = module.exports;

		if (target.isStunned) {
			damage += bonus;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(target, slow);
		return dealDamage([target], user, damage, false, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Warhammer", "Unstoppable Warhammer")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setDurability(15)
	.setDamage(75)
	.setBonus(75); // damage
