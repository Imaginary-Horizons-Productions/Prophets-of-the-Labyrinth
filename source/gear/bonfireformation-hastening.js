const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Hastening Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["critical", "@{mod0} and @{mod1} + @{critBonus}, reduce ally cooldowns by @{cooldownReduction}"]
	],
	"Maneuver",
	"Fire"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers: [excellence, attunement], scalings: { critBonus, cooldownReduction } } = module.exports;
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
			excellence.stacks += critBonus;
			attunement.stacks += critBonus;
			const hadCooldowns = [];
			for (const target of targets) {
				let didCooldown = false;
				target.gear?.forEach(gear => {
					if (gear.cooldown > 1) {
						didCooldown = true;
						gear.cooldown -= cooldownReduction;
					}
				})
				if (didCooldown) {
					hadCooldowns.push(target.name);
				}
			}
			resultLines.push(`${listifyEN(hadCooldowns)} had their cooldowns hastened.`);
		}
		return generateModifierResultLines(combineModifierReceipts([...addModifier(targets, pendingExcellence), ...addModifier(targets, pendingAttunement)])).concat(resultLines);
	}, { type: "all", team: "ally" })
	.setSidegrades("Charging Bonfire Formation")
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 })
	.setScalings({
		critBonus: 1,
		cooldownReduction: 1
	});
