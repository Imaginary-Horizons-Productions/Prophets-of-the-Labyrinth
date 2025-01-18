const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Midas's Shortsword",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod1Stacks} @{mod1} on a single foe and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus }, modifiers: [finesse, curseOfMidas] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(generateModifierResultLines(addModifier([user], finesse).concat(addModifier(stillLivingTargets, curseOfMidas))));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2
	})
	.setModifiers({ name: "Finesse", stacks: 1 }, { name: "Curse of Midas", stacks: 1 });
