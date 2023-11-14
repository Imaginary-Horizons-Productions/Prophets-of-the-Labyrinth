const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, getCombatantWeaknesses } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Pistol",
	"Strike a foe for @{damage} @{element} damage, give a random ally @{mod0Stacks} @{mod0} if the foe is weak to @{element}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		let { damage, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (getCombatantWeaknesses(target).includes(element)) {
			const damageText = dealDamage([target], user, damage * (isCrit ? critMultiplier : 1), false, element, adventure);
			const ally = adventure.delvers[adventure.generateRandomNumber(adventure.delvers.length, "battle")];
			addModifier(ally, powerUp);
			return `${damageText} ${ally.name} was Powered Up!`
		} else {
			return dealDamage([target], user, damage * (isCrit ? critMultiplier : 1), false, element, adventure);
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Double Pistol", "Duelist's Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(75);
