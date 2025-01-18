const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Vacuum Implosion",
	[
		["use", "Deal <@{damage} (+ @{duelistsBonus} if only attacker)> @{essence} damage to a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(200)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { damage, duelistsBonus, critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		// Duelist's check
		const userIndex = adventure.getCombatantIndex(user);
		const targetIndex = adventure.getCombatant(target);
		if (adventure.room.moves.every(move => (move.userReference.team === user.team && move.userReference.index === userIndex) && (move.userReference.team !== user.team) && move.targets.every(moveTarget => moveTarget.team !== target.team || moveTarget.index !== targetIndex))) {
			pendingDamage += duelistsBonus;
		}
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage([target], user, pendingDamage, false, essence, adventure);
	}, { type: "single", team: "foe" })
	.setUpgrades("Shattering Vacuum Implosion", "Urgent Vacuum Implosion")
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		duelistsBonus: 75,
		critBonus: 2
	});
