const { GearTemplate, Move } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { payHP, changeStagger, addProtection } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reinforced Blood Aegis",
	[
		["use", "Gain @{protection} protection and intercept a later single target move"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	([target], user, adventure) => {
		const { essence, protection, critMultiplier, pactCost: [pactCostValue] } = module.exports;
		const paymentLines = payHP(user, pactCostValue, adventure);
		if (adventure.lives < 1) {
			return paymentLines;
		}
		const resultLines = [`Gaining protection, ${paymentLines[0]}`].concat(paymentLines.slice(1));
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
			resultLines.push(`${target.name} falls for the provocation.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Charging Blood Aegis", "Toxic Blood Aegis")
	.setPactCost([25, "@{pactCost} HP"])
	.setProtection(200)
	.setCooldown(0);
