const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Weakening Battle Standard",
	[
		["use", "Inflcit <@{damage}> @{essence} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, morale }, modifiers: [weakness] } = module.exports;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	return damageResults.concat(resultLines, generateModifierResultLines(addModifier(survivors, weakness)));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	})
	.setModifiers({ name: "Weakness", stacks: 10 });
