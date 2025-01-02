const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, concatTeamMembersWithModifier, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Surpassing Elemental Scroll",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod2Stacks} @{mod2} to an ally and allies with @{mod1}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Support",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [attunement, vigilance, excellence], critMultiplier } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, vigilance.name);
		if (user.essence === essence) {
			changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingAttunement = { ...attunement };
		if (user.crit) {
			pendingAttunement.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingAttunement).concat(addModifier(allTargets, excellence))));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Balanced Elemental Scroll")
	.setCooldown(1)
	.setModifiers({ name: "Attunement", stacks: 3 }, { name: "Vigilance", stacks: 0 }, { name: "Excellence", stacks: 2 });
