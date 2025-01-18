const { GearTemplate } = require('../classes');
const { dealDamage, generateModifierResultLines, addModifier, getCombatantCounters } = require('../util/combatantUtil');
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
	.setModifiers(deckOfCardsMisfortune(variantName))
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
