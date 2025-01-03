const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Vacuum Implosion",
	[
		["use", "Inflict <@{damage} + @{bonus} if only attacker> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	([target], user, adventure) => {
		const { essence, damage, bonus, critMultiplier, modifiers: [frailty] } = module.exports;
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
		return dealDamage([target], user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier([target], frailty)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Urgent Vacuum Implosion")
	.setCharges(15)
	.setDamage(40)
	.setBonus(75)
	.setModifiers({ name: "Frailty", stacks: 3 });
