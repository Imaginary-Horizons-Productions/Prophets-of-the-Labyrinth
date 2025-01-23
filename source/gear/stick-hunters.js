const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Hunter's Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, gain @{mod1Stacks} @{mod1} if they're downed"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [impotence, empowerment] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const reciepts = [];
	changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	if (survivors.length < targets.length) {
		reciepts.push(...addModifier([user], empowerment));
	}
	reciepts.push(...addModifier(survivors, impotence));
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Impotence", stacks: 3 }, { name: "Empowerment", stacks: 25 });
