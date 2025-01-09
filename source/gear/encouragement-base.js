const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Encouragement",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} and @{mod1} x @{critMultiplier}"]
	],
	"Spell",
	"Light",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [excellence, empowerment], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingExcellence = { name: excellence.name, stacks: excellence.stacks.generator(user) };
		const pendingEmpowerment = { name: empowerment.name, stacks: empowerment.stacks.generator(user) };
		if (user.crit) {
			pendingExcellence.stacks *= critMultiplier;
			pendingEmpowerment.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingExcellence).concat(addModifier(targets, pendingEmpowerment))));
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
