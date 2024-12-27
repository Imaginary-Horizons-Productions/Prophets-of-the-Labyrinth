const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Numbing Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and inflict @{mod1Stacks} @{mod1} on a foe and intercept their later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [evasion, clumsiness], critMultiplier } = module.exports;
		const pendingEvasion = { ...evasion };
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingEvasion.stacks *= critMultiplier;
		}
		const resultLines = generateModifierResultLines(addModifier([user], pendingEvasion));
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetEffects = [];
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			targetEffects.push("falls for the provocation");
		}
		const addedClumsiness = addModifier([target], clumsiness).some(receipt => receipt.succeeded.size > 0);
		if (addedClumsiness) {
			targetEffects.push(`gains ${getApplicationEmojiMarkdown("Clumsiness")}`);
		} else {
			targetEffects.push(`is oblivious to ${getApplicationEmojiMarkdown("Clumsiness")}`);
		}
		if (targetEffects.length > 0) {
			resultLines.push(`${target.name} ${listifyEN(targetEffects)}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Heat Mirage", "Vigilant Heat Mirage")
	.setModifiers({ name: "Evasion", stacks: 2 }, { name: "Clumsiness", stacks: 2 })
	.setCharges(10);
