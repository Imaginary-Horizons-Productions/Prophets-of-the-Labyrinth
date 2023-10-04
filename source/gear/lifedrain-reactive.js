const { GearTemplate, Move } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Life Drain",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage, then gain @{healing} hp",
	"Healing x@{critBonus}",
	"Spell",
	"Darkness",
	350,
	needsLivingTargets(async ([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, bonus, healing, critBonus } = module.exports;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === target.team && move.userReference.index === adventure.getCombatantIndex(target));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			damage += bonus;
		}
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			healing *= critBonus;
		}
		return `${await dealDamage([target], user, damage, false, element, adventure)} ${gainHealth(user, healing, adventure)}`;
	}
	)
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Flanking Life Drain", "Urgent Life Drain")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setDamage(75)
	.setHealing(25)
	.setBonus(50); // damage
