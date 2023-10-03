const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thick Battleaxe",
	"Strike a foe for @{damage} @{element} damage, gain @{mod1Stacks} @{mod1}",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, exposed], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, exposed);
		return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
			return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`
		});
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Prideful Battleaxe", "Thirsting Battleaxe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Exposed", stacks: 1 }])
	.setDurability(30)
	.setDamage(125);
