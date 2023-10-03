const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Piercing Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if foe is already stunned) unblockable @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, bonus, critBonus } = module.exports;
		if (target.getModifierStacks("Stun") > 0) {
			damage += bonus;
		}
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		return dealDamage([target], user, damage, true, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Slowing Warhammer")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setDamage(75)
	.setBonus(75); // damage
