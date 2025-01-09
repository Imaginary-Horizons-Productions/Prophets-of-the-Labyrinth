const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Charging Bonfire Formation",
	[
		["use", "Grant all allies @{mod0Stacks} @{mod0}, @{mod1Stacks} @{mod1}, and @{mod2Stacks} @{mod2}"],
		["Critical💥", "@{mod0} and @{mod1} + @{critMultiplier}"]
	],
	"Maneuver",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, moraleRequirement, modifiers: [excellence, attunement, empowerment], critMultiplier } = module.exports;
		if (user.team === "delver" && adventure.room.morale < moraleRequirement) {
			return ["...but the party didn't have enough morale to pull it off."];
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
		return generateModifierResultLines(combineModifierReceipts([...addModifier(targets, pendingExcellence), ...addModifier(targets, pendingAttunement), ...addModifier(targets, empowerment)]));
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Hastening Bonfire Formation")
	.setMoraleRequirement(1)
	.setModifiers({ name: "Excellence", stacks: 2 }, { name: "Attunement", stacks: 2 }, { name: "Empowerment", stacks: 25 })
	.setCritMultiplier(1);
