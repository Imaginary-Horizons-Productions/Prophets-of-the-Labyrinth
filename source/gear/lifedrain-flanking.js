const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}, then gain @{healing} hp",
	"Healing x@{critBonus}",
	"Spell",
	"Darkness",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [exposed], damage, healing, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			healing *= critBonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${gainHealth(user, healing, adventure)}`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Reactive Life Drain", "Urgent Life Drain")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(75)
	.setHealing(25);
