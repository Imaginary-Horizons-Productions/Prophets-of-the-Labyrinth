const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up)",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		let { element, damage, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		damage += powerUpStacks;
		if (isCrit) {
			damage *= critMultiplier;
			damage += powerUpStacks;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	}
).setUpgrades("Accelerating Lance", "Unstoppable Lance", "Vigilant Lance")
	.setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setDurability(15)
	.setDamage(75);
