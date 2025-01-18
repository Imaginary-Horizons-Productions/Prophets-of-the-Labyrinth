const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, getCombatantCounters } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const actionName = "Omenous Deck of Cards";
module.exports = new GearTemplate(actionName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} (doubled if Essence Countering) on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	if (stillLivingTargets.length > 0) {
		let misfortuneStacks = misfortune.stacks.calculate(user);
		if (getCombatantCounters(targets[0]).includes(essence)) {
			misfortuneStacks *= 2;
		}
		resultLines.push(...generateModifierResultLines(addModifier(stillLivingTargets, { name: misfortune.name, stacks: misfortuneStacks })))
	}
	return resultLines;
}, { type: "single", team: "foe" })
	.setModifiers({ name: "Misfortune", stacks: { description: "a random amount between 2 and 9", calculate: (user) => 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0] } })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
