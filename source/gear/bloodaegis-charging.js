const { GearTemplate, Move } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, payHP, changeStagger, addProtection, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Charging Blood Aegis",
	[
		["use", "Pay @{hpCost} HP; gain @{protection} protection and @{mod0Stacks} @{mod0}, then intercept a later single target move"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier, hpCost } = module.exports;
		const paymentSentence = payHP(user, hpCost, adventure);
		if (adventure.lives < 1) {
			return [paymentSentence];
		}
		const resultLines = [`Gaining protection, ${paymentSentence}`];
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([user], user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		resultLines.push(...generateModifierResultLines(addModifier([user], powerUp)));
		const targetMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(target), team: target.team });
		const userMove = adventure.room.findCombatantMove({ index: adventure.getCombatantIndex(user), team: user.team });
		if (targetMove.targets.length === 1 && Move.compareMoveSpeed(userMove, targetMove) < 0) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Reinforced Blood Aegis", "Toxic Blood Aegis")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setHPCost(25)
	.setProtection(125);
