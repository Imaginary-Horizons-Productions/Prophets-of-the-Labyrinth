const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire",
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [excellence] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(generateModifierResultLines(addModifier([user], excellence)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Excellence", stacks: 2 });
