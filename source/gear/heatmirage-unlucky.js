const { GearTemplate, Move } = require('../classes');
const { changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Unlucky Heat Mirage",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and inflict @{mod1Stacks} @{mod1} on a foe and intercept their later single target move"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [evade, unlucky], critMultiplier } = module.exports;
		const pendingEvade = { ...evade };
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (user.crit) {
			pendingEvade.stacks *= critMultiplier;
		}
		const resultLines = generateModifierResultLines(addModifier([user], pendingEvade));
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		const targetEffects = [];
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			targetEffects.push("falls for the provocation");
		}
		const addedUnlucky = addModifier([target], unlucky).some(receipt => receipt.succeeded.size > 0);
		if (addedUnlucky) {
			targetEffects.push(`gains ${getApplicationEmojiMarkdown("Unlucky")}`);
		} else {
			targetEffects.push(`is oblivious to ${getApplicationEmojiMarkdown("Unlucky")}`);
		}
		if (targetEffects.length > 0) {
			resultLines.push(`${target.name} ${listifyEN(targetEffects)}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Heat Mirage", "Vigilant Heat Mirage")
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Unlucky", stacks: 2 })
	.setDurability(10);
