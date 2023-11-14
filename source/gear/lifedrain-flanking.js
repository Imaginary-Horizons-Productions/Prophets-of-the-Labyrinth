const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}, then gain @{healing} hp",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [exposed], damage, healing, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			healing *= critMultiplier;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${gainHealth(user, healing, adventure)}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Life Drain", "Urgent Life Drain")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(75)
	.setHealing(25);
