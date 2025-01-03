const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} and @{mod1} + @{critMultiplier}"]
	],
	"Maneuver",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers: [excellence, attunement], critMultiplier } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough Morale to pull it off."];
		}

		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingExcellence = { ...excellence };
		const pendingAttunement = { ...attunement };
		if (user.crit) {
			excellence.stacks += critMultiplier;
			attunement.stacks += critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts([...addModifier(targets, pendingExcellence), ...addModifier(targets, pendingAttunement)]));
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setUpgrades("Charging Bonfire Formation", "Hastening Bonfire Formation")
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 })
	.setCritMultiplier(1);
