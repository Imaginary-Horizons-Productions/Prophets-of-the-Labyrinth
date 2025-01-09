const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Shattering Shadow of Confusion",
	[
		["use", "Redirect a slower foe into targeting themself and inflict @{mod1Stacks} @{mod1}"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
	"Spell",
	"Darkness",
	350,
	([target], user, adventure) => {
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
			resultLines.push(...generateModifierResultLines(addModifier([user], evade)));
		}
		return resultLines.concat(generateModifierResultLines(addModifier([target], frailty)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Incompatible Shadow of Confusion")
	.setCharges(15)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + Bonus HP ÷ 50", generator: (user) => 2 + Math.floor(user.getBonusHP() / 50) } },
		{ name: "Frailty", stacks: 3 });
