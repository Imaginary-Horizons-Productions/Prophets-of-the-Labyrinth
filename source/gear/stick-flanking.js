const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Flanking Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on a single foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence, exposure] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(stillLivingTargets, impotence), addModifier(stillLivingTargets, exposure))));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Impotence", stacks: 3 }, { name: "Exposure", stacks: 2 });
