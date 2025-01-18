const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critBonus}, increase the party's morale by @{morale}"]
	],
	"Offense",
	"Light"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, morale } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		const resultLines = [];
		if (user.crit) {
			pendingDamage *= critBonus;
			adventure.room.morale += morale;
			resultLines.push("The party's morale is increased!")
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(resultLines);
	}, { type: "single", team: "foe" })
	.setUpgrades("Tormenting Battle Standard", "Thief's Battle Standard")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		morale: 1
	});
