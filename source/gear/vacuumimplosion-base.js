const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vacuum Implosion",
	[
		["use", "Deal <@{damage} + @{bonus} if only attacker> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Spell",
	"Wind",
	200,
	([target], user, adventure) => {
		const { essence, damage, bonus, critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		// Duelist's check
		const userIndex = adventure.getCombatantIndex(user);
		const targetIndex = adventure.getCombatant(target);
		if (adventure.room.moves.every(move => (move.userReference.team === user.team && move.userReference.index === userIndex) && (move.userReference.team !== user.team) && move.targets.every(moveTarget => moveTarget.team !== target.team || moveTarget.index !== targetIndex))) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, false, essence, adventure);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Shattering Vacuum Implosion", "Urgent Vacuum Implosion")
	.setCharges(15)
	.setDamage(40)
	.setBonus(75);
