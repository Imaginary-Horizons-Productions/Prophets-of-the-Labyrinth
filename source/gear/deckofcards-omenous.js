const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, getCombatantCounters } = require('../util/combatantUtil');

const actionName = "Omenous Deck of Cards";
module.exports = new GearTemplate(actionName,
	[
		["use", "Inflict @{damage} @{essence} damage and between @{bonus} and @{bonus2} stacks of @{mod0} randomly (doubled if Essence Countering) on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Wind",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [misfortune] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			let misfortuneStacks = 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0];
			if (getCombatantCounters(targets[0]).includes(essence)) {
				misfortune *= 2;
			}
			resultLines.push(...generateModifierResultLines(addModifier(stillLivingTargets, { name: misfortune.name, stacks: misfortuneStacks })))
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Misfortune", stacks: 0 })
	.setBonus(2) // Min stacks
	.setBonus2(9) // Max stacks
	.setRnConfig({
		["Deck of Cards"]: 1
	});
