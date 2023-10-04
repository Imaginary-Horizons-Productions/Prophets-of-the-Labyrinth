const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Battleaxe",
	"Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1}; heal @{healing} hp on kill",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, exposed], damage, critBonus, healing } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, exposed);
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (target.hp < 1) {
			damageText += gainHealth(user, healing, adventure);
		}
		return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Prideful Battleaxe", "Thick Battleaxe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setDurability(15)
	.setDamage(125)
	.setHealing(60);
