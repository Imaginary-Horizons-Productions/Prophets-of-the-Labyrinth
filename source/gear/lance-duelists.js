const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Duelist's Lance",
	[
		["use", "Strike a foe for <@{damage} + @{bonusSpeed} + @{bonus} if only attacker> @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, damage, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + Math.max(0, user.getSpeed(true) - 100) + damage;
		// Duelist's check
		const userIndex = adventure.getCombatantIndex(user);
		const targetIndex = adventure.getCombatant(targets[0]);
		if (adventure.room.moves.every(move => (move.userReference.team === user.team && move.userReference.index === userIndex) && (move.userReference.team !== user.team) && move.targets.every(moveTarget => moveTarget.team !== targets[0].team || moveTarget.index !== targetIndex))) {
			pendingDamage += bonus;
		}
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Shattering Lance", "Surpassing Lance")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(75); // Duelist's damage
