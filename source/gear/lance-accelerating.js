const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Accelerating Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [quicken], damage, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		damage += powerUpStacks;
		if (isCrit) {
			damage *= critMultiplier;
			damage += powerUpStacks;
		}
		addModifier(user, quicken);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Quickened.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Unstoppable Lance", "Vigilant Lance")
	.setModifiers({ name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(75);
