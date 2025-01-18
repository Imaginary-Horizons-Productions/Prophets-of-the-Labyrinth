const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Illumination",
	[
		["use", "Reduce a single ally's cooldowns by @{cooldownReduction}"],
		["Critical💥", "Increase the party's morale by @{morale}"]
	],
	"Spell",
	"Light"
).setCost(200)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { cooldownReduction, morale } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const resultLines = [];
		for (const target of targets) {
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= cooldownReduction;
				}
			})
			if (didCooldown) {
				resultLines.push(`${target.name} had their cooldowns hastened.`);
			}
		}
		if (user.crit) {
			adventure.room.morale += morale;
			resultLines.push("The party's morale is increased!");
		}
		return resultLines;
	}, { type: "single", team: "ally" })
	.setUpgrades("Balanced Illumination", "Inspiring Illumination")
	.setCharges(15)
	.setScalings({
		cooldownReduction: 1,
		morale: 1
	});
