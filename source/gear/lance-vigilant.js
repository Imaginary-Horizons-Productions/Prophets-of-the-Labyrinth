const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vigilant Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance], damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		pendingDamage += powerUpStacks;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedVigilance = addModifier(user, vigilance);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${addedVigilance ? ` ${user.getName(adventure.room.enemyIdMap)} gains Vigilance.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Unstoppable Lance")
	.setModifiers({ name: "Vigilance", stacks: 2 })
	.setDurability(15)
	.setDamage(40);
