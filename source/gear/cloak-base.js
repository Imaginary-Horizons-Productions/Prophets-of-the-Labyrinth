const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cloak",
	[
		["use", "Gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Defense",
	"Fire",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [evasion], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.generator(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critMultiplier;
		}
		return generateModifierResultLines(addModifier([user], pendingEvasion));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Accurate Cloak", "Powerful Cloak")
	.setCooldown(1)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + Bonus HP ÷ 50", generator: (user) => 2 + Math.floor(user.getBonusHP() / 50) } });
