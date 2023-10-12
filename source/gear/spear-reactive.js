const { GearTemplate, Move } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Spear",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage",
	"Also inflict @{mod1Stacks} @{mod1}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, critStagger], damage, bonus } = module.exports;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			damage += bonus;
		}
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			addModifier(target, critStagger);
		}
		return dealDamage([target], user, damage, false, element, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Spear", "Sweeping Spear")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setDamage(100)
	.setBonus(75); // damage
