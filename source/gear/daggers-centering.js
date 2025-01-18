const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Centering Daggers",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, gain @{mod0Stacks} @{mod0}, and shrug off @{selfStagger*-1} Stagger"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Fire",
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, selfStagger }, modifiers: [excellence] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	changeStagger([user], user, selfStagger);
	return resultLines.concat(generateModifierResultLines(addModifier([user], excellence)), `${user.name} shrugs off some Stagger.`);
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		selfStagger: -2
	})
	.setModifiers({ name: "Excellence", stacks: 2 });
