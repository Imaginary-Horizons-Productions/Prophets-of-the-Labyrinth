const { GearTemplate, Move } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Evasive Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and intercept the target's later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [evade], critMultiplier } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([target], user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingEvade.stacks *= critMultiplier;
		}
		const resultLines = generateModifierResultLines(addModifier([user], pendingEvade));
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Unlucky Heat Mirage", "Vigilant Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 3 })
	.setCharges(10);
