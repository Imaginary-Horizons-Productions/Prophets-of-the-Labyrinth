const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Taunting Conjured Ice Pillar",
	[
		["use", "Gain <@{mod0Stacks}> @{mod0} and @{mod1Stacks} @{mod1} then intercept your target's later single target move"],
		["Critical💥", "@{mod0} x @{critBonus}"]
	],
	"Spell",
	"Water"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, modifiers: [evasion, vigilance], scalings: { critBonus } } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.calculate(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critBonus;
		}
		const resultLines = generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvasion).concat(addModifier([user], vigilance))));
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Devoted Conjured Ice Pillar")
	.setCharges(15)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + 2% Bonus HP", calculate: (user) => 2 + Math.floor(user.getBonusHP() / 50) } }, { name: "Vigilance", stacks: 1 })
	.setScalings({ critBonus: 2 });
