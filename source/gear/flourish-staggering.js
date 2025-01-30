const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Staggering Flourish",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [distraction], stagger } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	let pendingStagger = stagger;
	if (user.essence === essence) {
		pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
	}
	changeStagger(survivors, user, pendingStagger);
	return resultLines.concat(generateModifierResultLines(addModifier(survivors, distraction)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Distraction", stacks: 3 })
	.setStagger(2);
