const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

const bounceCount = 6;
module.exports = new GearTemplate("Double Smokescreen",
	[
		["use", `Grant ${bounceCount} random allies @{mod0Stacks} @{mod0}`],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Defense",
	"Earth",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [evasion], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.generator(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEvasion)));
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}${bounceCount}`, team: "ally" })
	.setUpgrades("Chaining Smokescreen", "Double Smokescreen")
	.setCooldown(1)
	.setModifiers({ name: "Evasion", stacks: { description: "1 + Bonus HP ÷ 50", generator: (user) => 1 + Math.floor(user.getBonusHP() / 50) } });
