const { GearTemplate } = require('../classes');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { deckOfCardsMisfortune } = require('./shared/modifiers');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const variantName = "Tormenting Deck of Cards";
module.exports = new GearTemplate(variantName,
	[
		["use", "Deal <@{damage}> @{essence} damage, increase debuff stacks by @{debuffIncrement}, and inflict <@{mod0Stacks}> @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Wind"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, debuffIncrement }, modifiers: [misfortune] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const reciepts = [];
	for (const target of survivors) {
		for (const modifier in target.modifiers) {
			if (getModifierCategory(modifier) === "Debuff") {
				reciepts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
			}
		}
	}
	reciepts.push(...addModifier(survivors, { name: misfortune.name, stacks: misfortune.stacks.calculate(user) }));
	return resultLines.concat(generateModifierResultLines(reciepts));
}, { type: "single", team: "foe" })
	.setModifiers(deckOfCardsMisfortune(variantName))
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		debuffIncrement: 1
	})
	.setRnConfig({ ["Deck of Cards"]: 1 });
