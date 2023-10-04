const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Warhammer",
	"Strike a foe for @{damage} (+@{bonus} if after foe or if foe is currently stunned) @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		const { element, modifiers: [elementStagger], damage, bonus, critBonus } = module.exports;
		let pendingDamage = damage;
		if (target.getModifierStacks("Stun") > 0) {
			pendingDamage += bonus;
		}
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += bonus;
		}

		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			pendingDamage *= critBonus;
		}
		return dealDamage([target], user, pendingDamage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Piercing Warhammer", "Slowing Warhammer")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setDamage(75)
	.setBonus(75); // damage
