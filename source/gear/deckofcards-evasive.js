const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const actionName = "Evasive Deck of Cards";
module.exports = new GearTemplate(actionName,
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a single foe and gain @{mod1Stacks} @{mod1}"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune, evasion] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }).concat(addModifier([user], evasion))));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers(
		{ name: "Misfortune", stacks: { description: "a random amount between 2 and 9", calculate: (user) => 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0] } },
		{ name: "Evasion", stacks: 2 }
	)
	.setRnConfig({ ["Deck of Cards"]: 1 });
