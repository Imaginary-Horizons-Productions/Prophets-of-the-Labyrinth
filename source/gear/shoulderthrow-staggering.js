const { GearTemplate, Move } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Staggering Shoulder Throw",
	[
		["use", "Redirect a slower foe into targeting themself"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [evade] } = module.exports;
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}
		const resultLines = [`${target.name} is Staggered.`];
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
			resultLines.push(`${target.name} is redirected into targeting themself.`);
		}
		if (user.crit) {
			resultLines.push(...generateModifierResultLines(addModifier([user], evade)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Shoulder Throw", "Harmful Shoulder Throw")
	.setDurability(10)
	.setModifiers({ name: "Evade", stacks: 1 })
	.setStagger(2);
