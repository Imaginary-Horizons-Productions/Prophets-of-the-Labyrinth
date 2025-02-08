const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, changeStagger } = require('../util/combatantUtil');
const { deckOfCardsMisfortune } = require('./shared/modifiers');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Numbing Deck of Cards";
module.exports = new GearTemplate(variantName,
	[
		["use", "Inflict <@{damage}> @{essence} damage, @{mod1Stacks} @{mod1}, and <@{mod0Stacks}> @{mod0} on a foe"],
		["critical", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [misfortune, clumsiness] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }).concat(addModifier(survivors, clumsiness))));
}, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(variantName), { name: "Clumsiness", stacks: 1 })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
