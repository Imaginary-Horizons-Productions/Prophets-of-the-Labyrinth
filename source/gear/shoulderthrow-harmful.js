const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, dealDamage, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Harmful Shoulder Throw",
	[
		["use", "Strike a foe for @{damage} @{essence} damage then redirect them into targeting themself if they're slower"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [evasion], damage } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage([target], user, damage, false, essence, adventure);
		if (target.hp > 0) {
			const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
			const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
			if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
				targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
				resultLines.push(`${target.name} is redirected into targeting themself.`);
			}
		}
		if (user.crit) {
			resultLines.push(...generateModifierResultLines(addModifier([user], evasion)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Shoulder Throw", "Staggering Shoulder Throw")
	.setCooldown(2)
	.setModifiers({ name: "Evasion", stacks: 1 })
	.setDamage(15);
