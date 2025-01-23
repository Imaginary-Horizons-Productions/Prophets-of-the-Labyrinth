const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator, archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Taunting Lance",
	[
		["use", "Gain <@{protection}> protection, then deal <@{damage}> @{essence} damage to a foe"],
		["Critical💥", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect(([target], user, adventure) => {
	const { essence, scalings: { damage, protection, critBonus } } = module.exports;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage([target], user, damage.calculate(user), false, essence, adventure);
	resultLines.push(`${user.name} gains protection.`);
	if (survivors.length > 0) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
	}
	return resultLines;
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	});
