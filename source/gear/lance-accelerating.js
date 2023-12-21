const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Accelerating Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [quicken], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedQuicken = addModifier(user, quicken);
		return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${addedQuicken ? ` ${user.getName(adventure.room.enemyIdMap)} is Quickened.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Unstoppable Lance", "Vigilant Lance")
	.setModifiers({ name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(40);
