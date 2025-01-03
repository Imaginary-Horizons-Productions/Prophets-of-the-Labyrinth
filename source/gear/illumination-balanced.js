const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Balanced Illumination",
	[
		["use", "Reduce a single ally's cooldowns by @{bonus} and grant them @{mod0Stacks} @{mod0}"],
		["Critical💥", "Increase the party's morale by @{bonus2}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, bonus2, modifiers: [finesse] } = module.exports;
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
			resultLines.push("The party's morale is increased!");
		}
		return resultLines.concat(generateModifierResultLines(addModifier(targets, finesse)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setCharges(15)
	.setBonus(1) // Cooldown reduction
	.setBonus2(1) // Morale
	.setModifiers({ name: "Finesse", stacks: 1 });
