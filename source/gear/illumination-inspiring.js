const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Inspiring Illumination",
	[
		["use", "Reduce an ally's cooldowns by @{cooldownReduction} and increase the party's morale by @{baseMorale}"],
		["critical", "Increase the party's morale by @{critMorale}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { cooldownReduction, baseMorale, critMorale } } = module.exports;
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
			adventure.room.morale += critMorale;
		}
		adventure.room.morale += baseMorale;
		resultLines.push("The party's morale is increased!");
		return resultLines;
	}, { type: "single", team: "ally" })
	.setSidegrades("Balanced Illumination")
	.setCharges(15)
	.setScalings({
		cooldownReduction: 1,
		baseMorale: 1,
		critMorale: 1
	});
