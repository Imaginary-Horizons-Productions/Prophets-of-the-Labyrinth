const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier, concatTeamMembersWithModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Rallying Encouragement",
	[
		["use", "Grant @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally and all allies with @{mod2}"],
		["Critical💥", "@{mod0} and @{mod1} x @{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [excellence, empowerment, targetModifier], critMultiplier } = module.exports;
		const allTargets = concatTeamMembersWithModifier(targets, user.team === "delver" ? adventure.delvers : adventure.room.enemies, targetModifier.name);
		if (user.essence === essence) {
			changeStagger(allTargets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingExcellence = { name: excellence.name, stacks: excellence.stacks.generator(user) };
		const pendingEmpowerment = { name: empowerment.name, stacks: empowerment.stacks.generator(user) };
		if (user.crit) {
			pendingExcellence.stacks *= critMultiplier;
			pendingEmpowerment.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(allTargets, pendingExcellence).concat(addModifier(allTargets, pendingEmpowerment))));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Rallying Encouragement", "Vigorous Encouragement")
	.setCharges(15)
	.setModifiers({
		name: "Excellence", stacks: {
			description: "2 + Bonus Speed ÷ 10",
			generator: (user) => 2 + Math.floor(user.getBonusSpeed() / 10)
		}
	}, {
		name: "Empowerment", stacks: {
			description: "25 + Bonus Speed",
			generator: (user) => 25 + user.getBonusSpeed()
		}
	});
