const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Spear",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}, increase party morale by @{bonus}"]
	],
	"Action",
	"Light",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower();
		const resultLines = [];
		if (user.crit) {
			pendingDamage *= critMultiplier;
			adventure.room.morale += bonus;
			resultLines.push("The party's morale is increased!")
		}
		resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setBonus(1); // Morale
