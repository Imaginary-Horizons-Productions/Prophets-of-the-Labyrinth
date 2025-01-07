const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection } = require('../util/combatantUtil');

module.exports = new GearTemplate("Taunting Lance",
	[
		["use", "Gain @{protection} protection, then deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Protection x @{critMultiplier}"]
	],
	"Action",
	"Water",
	0,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier } = module.exports;
		let pendingProtection = protection + Math.floor(user.getBonusHP() / 5);
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		const resultLines = dealDamage([target], user, user.getPower(), false, essence, adventure).concat(`${user.name} gains protection.`);
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setProtection(25);
