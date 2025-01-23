const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Shattering Vacuum Implosion",
	[
		["use", "Inflict <@{damage} (+ @{duelistsBonus} if only attacker)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Spell",
	"Wind"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { damage, duelistsBonus, critBonus }, modifiers: [frailty] } = module.exports;
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
		const { resultLines, survivors } = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(generateModifierResultLines(addModifier([target], frailty)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Urgent Vacuum Implosion")
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		duelistsBonus: 75,
		critBonus: 2
	})
	.setModifiers({ name: "Frailty", stacks: 3 });
