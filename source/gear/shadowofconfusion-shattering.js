const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { scalingEvasion } = require('./shared/modifiers');

module.exports = new GearTemplate("Shattering Shadow of Confusion",
	[
		["use", "Redirect a slower foe into targeting themself and inflict @{mod1Stacks} @{mod1}"],
		["critical", "Gain <@{mod0Stacks}> @{mod0}"]
	],
	"Spell",
	"Darkness"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, modifiers: [evade, frailty] } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = [];
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: target.team, index: adventure.getCombatantIndex(target) }];
			resultLines.push(`${target.name} is redirected into targeting themself.`);
		}
		if (user.crit) {
			resultLines.push(...generateModifierResultLines(addModifier([user], { name: evade.name, stacks: evade.stacks.calculate(user) })));
		}
		return resultLines.concat(generateModifierResultLines(addModifier([target], frailty)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Incompatible Shadow of Confusion")
	.setCharges(15)
	.setModifiers(scalingEvasion(2), { name: "Frailty", stacks: 3 });
