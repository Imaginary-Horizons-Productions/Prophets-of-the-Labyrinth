const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Flanking Battle Standard",
	[
		["use", "Inflict <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, morale }, modifiers: [exposure] } = module.exports;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(resultLines, generateModifierResultLines(addModifier(survivors, exposure)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	})
	.setModifiers({ name: "Exposure", stacks: 2 });
