const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Evasive Shoulder Throw",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and redirect a slower foe into targeting themself"],
		["Critical💥", "Gain @{mod0Stacks} extra @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [evade] } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingEvade = { ...evade };
		if (user.crit) {
			pendingEvade.stacks++;
		}
		const resultLines = [];
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
			resultLines.push(`${target.name} is redirected into targeting themself.`);
		}
		return resultLines.concat(generateModifierResultLines(addModifier([user], pendingEvade)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Harmful Shoulder Throw", "Staggering Shoulder Throw")
	.setCooldown(2)
	.setModifiers({ name: "Evade", stacks: 1 });
