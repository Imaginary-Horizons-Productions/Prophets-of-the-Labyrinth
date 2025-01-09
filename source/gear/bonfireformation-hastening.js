const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Hastening Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} and @{mod1} + @{critMultiplier}, reduce ally cooldowns by @{bonus}"]
	],
	"Maneuver",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers: [excellence, attunement], critMultiplier, bonus } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingExcellence = { ...excellence };
		const pendingAttunement = { ...attunement };
		const resultLines = [];
		if (user.crit) {
			excellence.stacks += critMultiplier;
			attunement.stacks += critMultiplier;
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
			resultLines.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
		}
		return generateModifierResultLines(combineModifierReceipts([...addModifier(targets, pendingExcellence), ...addModifier(targets, pendingAttunement)])).concat(resultLines);
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setUpgrades("Charging Bonfire Formation")
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 })
	.setCritMultiplier(1)
	.setBonus(1); // Cooldown Reduction
