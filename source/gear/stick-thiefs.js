const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, generateModifierResultLines, addModifier, combineModifierReceipts, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Thief's Stick",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe, gain @{bounty}g if they're downed"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Action",
	"Earth"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, bounty }, modifiers: [impotence] } = module.exports;
	let pendingDamage = damage.calculate(user);
	if (user.crit) {
		pendingDamage *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		adventure.room.addResource("Gold", "Currency", "loot", bounty);
	}
	return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(survivors, impotence))));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		bounty: 30
	})
	.setModifiers({ name: "Impotence", stacks: 3 });
