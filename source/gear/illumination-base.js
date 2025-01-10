const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Illumination",
	[
		["use", "Reduce a single ally's cooldowns by @{bonus}"],
		["Critical💥", "Increase the party's morale by @{secondBonus}"]
	],
	"Spell",
	"Light",
	200,
	(targets, user, adventure) => {
		const { essence, bonus, secondBonus } = module.exports;
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
			adventure.room.morale += secondBonus;
			resultLines.push("The party's morale is increased!");
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Balanced Illumination", "Inspiring Illumination")
	.setCharges(15)
	.setBonus(1) // Cooldown reduction
	.setSecondBonus(1); // Morale
