const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, critBonus, morale } } = module.exports;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	const { resultLines: damageResults, survivors } = dealDamage(targets, user, pendingDamage, false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return damageResults.concat(resultLines);
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	});
