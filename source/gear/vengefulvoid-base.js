const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Vengeful Void",
	[
		["use", "Deal <@{damage} (+ @{reactiveBonus} if after the foe)> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Spell",
	"Darkness"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, reactiveBonus, critBonus } } = module.exports;
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
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setUpgrades("Hexing Vengeful Void", "Numbing Vengeful Void")
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		reactiveBonus: 75,
		critBonus: 2
	});
