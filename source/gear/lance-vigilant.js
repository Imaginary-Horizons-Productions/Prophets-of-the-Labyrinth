const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vigilant Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [vigilance], damage, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		damage += powerUpStacks;
		if (isCrit) {
			damage *= critMultiplier;
			damage += powerUpStacks;
		}
		addModifier(user, vigilance);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} gains Vigilance`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Unstoppable Lance")
	.setModifiers({ name: "Vigilance", stacks: 2 })
	.setDurability(15)
	.setDamage(75);
