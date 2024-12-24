const { GearTemplate, Move } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { payHP, changeStagger, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Toxic Blood Aegis",
	[
		["use", "Gain @{protection} protection, inflict @{mod0Stacks} @{mod0} on a foe and intercept their move"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [poison], protection, critMultiplier, pactCost: [pactCostValue] } = module.exports;
		const paymentSentence = payHP(user, pactCostValue, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		const resultLines = [`Gaining protection, ${paymentSentence}`];
		let pendingProtection = protection;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			const addedPoison = addModifier([target], poison).some(receipt => receipt.succeeded.size > 0);
			resultLines.push(`${target.name} falls for the provocation${addedPoison ? ` and gains ${getApplicationEmojiMarkdown("Poison")}` : ""}.`);
		} else {
			resultLines.push(...generateModifierResultLines(addModifier([target], poison)));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Charging Blood Aegis", "Reinforced Blood Aegis")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setPactCost([25, "@{pactCost} HP"])
	.setProtection(125);
