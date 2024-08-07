const { GearTemplate, Move } = require('../classes/index.js');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reactive Battleaxe",
	"Strike a foe for @{damage} (+@{bonus} if after foe) @{element} damage, gain @{mod0Stacks} @{mod0}",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const userMove = adventure.room.moves.find(move => move.userReference.team === user.team && move.userReference.index === adventure.getCombatantIndex(user));
		const targetMove = adventure.room.moves.find(move => move.userReference.team === targets[0].team && move.userReference.index === adventure.getCombatantIndex(targets[0]));

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedExposed = addModifier([user], exposed).length > 0;
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${addedExposed ? ` ${getNames([user], adventure)[0]} is Exposed.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Furious Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(30)
	.setDamage(90)
	.setBonus(75); // damage
