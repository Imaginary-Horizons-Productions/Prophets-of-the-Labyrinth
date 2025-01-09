const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

const actionName = "Evasive Deck of Cards";
module.exports = new GearTemplate(actionName,
	[
		["use", "Deal @{damage} @{essence} damage and inflict between @{bonus} and @{bonus2} stacks of @{mod0} randomly and gain @{mod1Stacks} @{mod1} on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Wind",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [misfortune, evasion] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, { name: misfortune.name, stacks: 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0] }).concat(addModifier([user], evasion))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Misfortune", stacks: 0 }, { name: "Evasion", stacks: 2 })
	.setBonus(2) // Min stacks
	.setBonus2(9) // Max stacks
	.setRnConfig({
		["Deck of Cards"]: 1
	});
