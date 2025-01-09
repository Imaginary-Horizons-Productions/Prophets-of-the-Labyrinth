const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Soothing Sandstorm Formation",
	[
		["use", "Reduce all cooldowns by @{bonus} for and grant @{mod1Stacks} @{mod1} to all allies"],
		["Critical💥", "Also grant @{mod0Stacks} @{mod0}"]
	],
	"Maneuver",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, bonus, modifiers: [impact, regeneration] } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
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
		const reciepts = [];
		if (user.crit) {
			reciepts.push(...addModifier(targets, impact));
		}
		reciepts.push(...addModifier(targets, regeneration));
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Balanced Sandstorm Formation")
	.setMoraleRequirement(2)
	.setBonus(1) // Cooldown Reduction
	.setModifiers({ name: "Impact", stacks: 2 }, { name: "Regeneration", stacks: 1 });
