const { GearTemplate } = require('../classes');
const { dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { deckOfCardsMisfortune } = require('./shared/modifiers');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Numbing Deck of Cards";
module.exports = new GearTemplate(variantName,
	[
		["use", "Inflict <@{damage}> @{essence} damage, @{mod1Stacks} @{mod1}, and <@{mod0Stacks}> @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune, clumsiness] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	return resultLines.concat(generateModifierResultLines(addModifier(stillLivingTargets, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }).concat(addModifier(stillLivingTargets, clumsiness))));
}, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(variantName), { name: "Clumsiness", stacks: 1 })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
