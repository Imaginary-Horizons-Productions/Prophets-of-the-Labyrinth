const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Sandstorm Formation",
	[
		["use", "Reduce all ally cooldowns by @{bonus}"],
		["Critical💥", "Also grant @{mod0Stacks} @{mod0}"]
	],
	"Maneuver",
	"Earth",
	200,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, bonus, modifiers: [impact] } = module.exports;
		if (adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const hadCooldowns = [];
		for (const target of targets) {
			let didCooldown = false;
			target.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= bonus;
				}
			})
			if (didCooldown) {
				hadCooldowns.push(target.name);
			}
		}
		const resultLines = [];
		if (hadCooldowns.length > 0) {
			resultLines.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
		}
		if (user.crit) {
			resultLines.push(...generateModifierResultLines(combineModifierReceipts(addModifier(targets, impact))));
		}
		if (resultLines.length > 0) {
			return resultLines;
		} else {
			return ["...but nothing happened."];
		}
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setUpgrades("Balanced Sandstorm Formation", "Soothing Sandstorm Formation")
	.setMoraleRequirement(2)
	.setBonus(1) // Cooldown Reduction
	.setModifiers({ name: "Impact", stacks: 2 });
