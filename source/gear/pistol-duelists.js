const { GearTemplate } = require("../classes");
const { dealDamage, addModifier, getCombatantWeaknesses } = require("../util/combatantUtil");

module.exports = new GearTemplate("Duelist's Pistol",
	"Strike a foe for @{damage} (+@{bonus} if only attacker) @{element} damage, give a random ally @{mod0Stacks} @{mod0} if the foe is weak to @{element}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { damage, bonus, critMultiplier, element, modifiers: [powerUp] } = module.exports;
		let pendingDamage = damage;
		const targetIndex = adventure.getCombatantIndex(target);
		const userIndex = adventure.getCombatantIndex(user);
		// Duelist's check
		if (!adventure.room.moves.some(move => !(move.userReference.team === user.team && move.userReference.index === userIndex) && move.targets.some(moveTarget => moveTarget.team === target.team && moveTarget.index === targetIndex))) {
			pendingDamage += bonus;
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (getCombatantWeaknesses(target).includes(element)) {
			const damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
			const ally = adventure.delvers[adventure.generateRandomNumber(adventure.delvers.length, "battle")];
			const addedPowerUp = addModifier(ally, powerUp);
			return `${damageText}${addedPowerUp ? ` ${ally.getName(adventure.room.enemyIdMap)} was Powered Up!` : ""}`;
		} else {
			return dealDamage([target], user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(75)
	.setBonus(75);
