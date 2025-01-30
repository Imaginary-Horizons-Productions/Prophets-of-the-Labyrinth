const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, getCombatantCounters, changeStagger } = require('../util/combatantUtil');
const { deckOfCardsMisfortune } = require('./shared/modifiers');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Omenous Deck of Cards";
module.exports = new GearTemplate(variantName,
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
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (survivors.length > 0) {
		if (user.essence === essence) {
			changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let misfortuneStacks = misfortune.stacks.calculate(user);
		if (getCombatantCounters(survivors[0]).includes(essence)) {
			misfortuneStacks *= 2;
		}
		resultLines.push(...generateModifierResultLines(addModifier(survivors, { name: misfortune.name, stacks: misfortuneStacks })))
	}
	return resultLines;
}, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(variantName))
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
