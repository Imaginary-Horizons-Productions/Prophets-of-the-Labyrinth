const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} (@{bonus}g on kill); pay HP for your @{mod0}",
	"Damage x@{critMultiplier}",
	"Pact",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], damage, bonus: bounty, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedPowerUp = addModifier(user, powerUp);
		let damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp < 1) {
			adventure.gainGold(bounty);
			damageText += ` ${user.getName(adventure.room.enemyIdMap)} gains ${bounty}g of victory spoils.`;
		}
		return `${payHP(user, user.getModifierStacks("Power Up"), adventure)}${damageText}${addedPowerUp ? ` ${user.getName(adventure.room.enemyIdMap)} is Powered Up.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setDamage(40)
	.setBonus(15);
