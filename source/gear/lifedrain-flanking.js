const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}, then gain @{healing} hp",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		const addedExposed = addModifier(target, exposed);
		return `${damageText}${addedExposed ? ` ${target.getName(adventure.room.enemyIdMap)} is Exposed.` : ""} ${gainHealth(user, pendingHealing, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Life Drain", "Urgent Life Drain")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40)
	.setHealing(25);
