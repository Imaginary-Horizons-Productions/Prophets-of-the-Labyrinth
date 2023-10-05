const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier, getCombatantWeaknesses } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Pistol",
	"Strike a foe for @{damage} @{element} damage, give a random ally @{mod1Stacks} @{mod1} if the foe is weak to @{element}",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { damage, critBonus, element, modifiers: [elementStagger, powerUp] } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (getCombatantWeaknesses(target).includes(element)) {
			const damageText = dealDamage([target], user, damage * (isCrit ? critBonus : 1), false, element, adventure);
			const ally = adventure.delvers[adventure.generateRandomNumber(adventure.delvers.length, "battle")];
			addModifier(ally, powerUp);
			return `${damageText} ${ally.name} was Powered Up!`
		} else {
			return dealDamage([target], user, damage * (isCrit ? critBonus : 1), false, element, adventure);
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Double Pistol", "Duelist's Pistol")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Power Up", stacks: 30 }])
	.setDurability(15)
	.setDamage(75);
