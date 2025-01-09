const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Hexing Vengeful Void",
	[
		["use", "Inflict <@{damage} + @{bonus} if after the foe> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, bonus, critMultiplier, modifiers: [misfortune] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(targets[0]), team: targets[0].team });

		if (Move.compareMoveSpeed(userMove, targetMove) > 0) {
			pendingDamage += bonus;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(addModifier(targets, misfortune)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Numbing Vengeful Void")
	.setCharges(15)
	.setDamage(40)
	.setBonus(75)
	.setModifiers({ name: "Misfortune", stacks: 8 });
