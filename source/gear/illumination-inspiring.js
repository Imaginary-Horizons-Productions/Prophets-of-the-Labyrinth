const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Inspiring Illumination",
	[
		["use", "Reduce a single ally's cooldowns by @{bonus} and increase the party's morale by @{bonus2}"],
		["Critical💥", "Increase the party's morale by @{bonus2}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, bonus2 } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const resultLines = [];
		for (const target of targets) {
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= bonus;
				}
			})
			if (didCooldown) {
				resultLines.push(`${target.name} had their cooldowns hastened.`);
			}
		}
		if (user.crit) {
			adventure.room.morale += bonus2;
		}
		adventure.room.morale += bonus2;
		resultLines.push("The party's morale is increased!");
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setCharges(15)
	.setBonus(1) // Cooldown reduction
	.setBonus2(1); // Morale
