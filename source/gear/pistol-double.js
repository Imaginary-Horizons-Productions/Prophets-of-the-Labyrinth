const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, getCombatantWeaknesses } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Double Pistol",
	"Strike a foe for @{damage} @{element} damage, give 2 random allies @{mod0Stacks} @{mod0} if the foe is weak to @{element}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { damage, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		let pendingDamage = damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (getCombatantWeaknesses(target).includes(element)) {
			const damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
			const poweredUpAllies = [];
			const ally = adventure.delvers[adventure.generateRandomNumber(adventure.delvers.length, "battle")];
			const poweredUpFirstAlly = addModifier(ally, powerUp);
			if (poweredUpFirstAlly) {
				poweredUpAllies.push(ally.getName(adventure.room.enemyIdMap));
			}
			const secondAlly = adventure.delvers[adventure.generateRandomNumber(adventure.delvers.length, "battle")];
			const poweredUpSecondAlly = addModifier(secondAlly, powerUp);
			if (poweredUpSecondAlly) {
				poweredUpAllies.push(secondAlly.getName(adventure.room.enemyIdMap));
			}
			if (poweredUpAllies.length === 2) { //TODONOW replace switches with else ifs for more order control
				return `${damageText} ${poweredUpAllies[0]} and ${poweredUpAllies[1]} were Powered Up!`;
			} else if (poweredUpAllies.length === 1) {
				return `${damageText} ${poweredUpAllies[0]} was Powered Up!`;
			}
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Duelist's Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(75);
