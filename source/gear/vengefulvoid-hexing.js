const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Hexing Vengeful Void",
	[
		["use", "Inflict <@{damage} (+ @{reactiveBonus} if after the foe)> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, reactiveBonus, critBonus }, modifiers: [misfortune] } = module.exports;
		let pendingDamage = damage.calculate(user);
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += reactiveBonus;
		}
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		if (survivors.length > 0) {
			if (user.essence === essence) {
				changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			resultLines.push(...generateModifierResultLines(addModifier(survivors, misfortune)));
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Numbing Vengeful Void")
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		reactiveBonus: 75,
		critBonus: 2
	})
	.setModifiers({ name: "Misfortune", stacks: 8 });
