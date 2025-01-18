const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Hunter's Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a single foe, gain @{mod1Stacks} @{mod1} if they're downed"],
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
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const reciepts = [];
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	if (stillLivingTargets.length < targets.length) {
		reciepts.push(...addModifier([user], empowerment));
	}
	reciepts.push(...addModifier(stillLivingTargets, impotence));
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Impotence", stacks: 3 }, { name: "Empowerment", stacks: 25 });
