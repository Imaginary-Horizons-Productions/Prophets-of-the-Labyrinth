const { GearTemplate } = require("../classes");
const { needsLivingTargets } = require("../shared/actionComponents");
const { dealDamage, addModifier, getCombatantWeaknesses } = require("../util/combatantUtil");
module.exports = new GearTemplate("Duelist's Pistol",
	"Strike a foe for @{damage} (+@{bonus} if only attacker) @{element} damage, give a random ally @{mod0Stacks} @{mod0} if the foe is weak to @{element}",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { damage, bonus, critBonus, element, modifiers: [powerUp] } = module.exports;
		const targetIndex = adventure.getCombatantIndex(target);
		const userIndex = adventure.getCombatantIndex(user);
		const isLoneAttacker = !adventure.room.moves.some(move => !(move.userReference.team === user.team && move.userReference.index === userIndex) && move.targets.some(moveTarget => moveTarget.team === target.team && moveTarget.index === targetIndex));
		let pendingDamage = damage + (isLoneAttacker ? bonus : 0);
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (getCombatantWeaknesses(target).includes(element)) {
			const damageText = dealDamage([target], user, pendingDamage * (isCrit ? critBonus : 1), false, element, adventure);
			const ally = adventure.delvers[adventure.generateRandomNumber(adventure.delvers.length, "battle")];
			addModifier(ally, powerUp);
			return `${damageText} ${ally.name} was Powered Up!`
		} else {
			return dealDamage([target], user, pendingDamage * (isCrit ? critBonus : 1), false, element, adventure);
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Double Pistol")
	.setModifiers({ name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(75)
	.setBonus(75);
