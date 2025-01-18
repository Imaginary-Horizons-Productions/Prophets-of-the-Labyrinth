const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Balanced Illumination",
	[
		["use", "Reduce a single ally's cooldowns by @{cooldownReduction} and grant them @{mod0Stacks} @{mod0}"],
		["Critical💥", "Increase the party's morale by @{morale}"]
	],
	"Spell",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { cooldownReduction, morale }, modifiers: [finesse] } = module.exports;
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
		return resultLines.concat(generateModifierResultLines(addModifier(targets, finesse)));
	}, { type: "single", team: "ally" })
	.setSidegrades("Inspiring Illumination")
	.setCharges(15)
	.setScalings({
		cooldownReduction: 1,
		morale: 1
	})
	.setModifiers({ name: "Finesse", stacks: 1 });
