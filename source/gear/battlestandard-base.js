const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Battle Standard",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}, gain @{bonus} Morale"]
	],
	"Offense",
	"Light",
	200,
	(targets, user, adventure) => {
		const { essence, damage, bonus } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		const resultLines = [];
		if (user.crit) {
			pendingDamage *= critMultiplier;
			adventure.room.morale += bonus;
			resultLines.push("The party's Morale is increased!")
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(resultLines);
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Tormenting Battle Standard", "Thief's Battle Standard")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(1); // Morale
