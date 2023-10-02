const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod1Stacks} @{mod1}, then gain @{healing} hp",
	"Healing x@{critBonus}",
	"Spell",
	"Darkness",
	350,
	needsLivingTargets(async ([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, exposed], damage, healing, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			healing *= critBonus;
		}
		let damageText = await dealDamage([target], user, damage, false, element, adventure);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${gainHealth(user, healing, adventure)}`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Reactive Life Drain", "Urgent Life Drain")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 2 }])
	.setDurability(15)
	.setDamage(75)
	.setHealing(25);
