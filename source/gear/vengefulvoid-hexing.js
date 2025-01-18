const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Hexing Vengeful Void",
	[
		["use", "Inflict <@{damage} (+ @{reactiveBonus} if after the foe)> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, reactiveBonus, critBonus }, modifiers: [misfortune] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += reactiveBonus;
		}
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, misfortune)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Numbing Vengeful Void")
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		reactiveBonus: 75,
		critBonus: 2
	})
	.setModifiers({ name: "Misfortune", stacks: 8 });
