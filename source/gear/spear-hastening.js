const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Hastening Spear",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe"],
		["Critical💥", "Damage x @{critMultiplier}, increase party morale by @{bonus}, reduce your cooldowns by @{bonus2}"]
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
			resultLines.push("The party's morale is increased!");
			user.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					gear.cooldown -= bonus;
				}
			})
			resultLines.push(`${user.name}'s cooldowns are hastened.`);
		}
		resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setBonus(1) // Morale
	.setBonus(1); // Cooldown reduction
