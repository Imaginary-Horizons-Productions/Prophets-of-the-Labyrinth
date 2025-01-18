const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier, combineModifierReceipts } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Attuned Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a single foe and gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1Stacks}"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [excellence, attunement] } = module.exports;
	let pendingDamge = damage.calculate(user);
	if (user.crit) {
		pendingDamge *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamge, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier([user], excellence).concat(addModifier([user], attunement)))));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 });
