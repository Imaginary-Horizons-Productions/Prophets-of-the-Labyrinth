const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Lance",
	"Apply @{mod0Stacks} @{mod0} and @{damage} @{element} damage (double increase from Power Up) to a foe",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [frail], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedFrail = addModifier(target, frail);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${addedFrail ? ` ${target.getName(adventure.room.enemyIdMap)} becomes Frail.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Unstoppable Lance")
	.setModifiers({ name: "Frail", stacks: 4 })
	.setDurability(15)
	.setDamage(40);
