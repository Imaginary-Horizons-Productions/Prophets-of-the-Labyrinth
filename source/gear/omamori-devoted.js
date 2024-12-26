const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Devoted Omamori",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [finesse], protection, critMultiplier } = module.exports;
		const pendingFinesse = { ...finesse };
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingFinesse.stacks *= critMultiplier;
		}
		addProtection(targets, protection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")].concat(generateModifierResultLines(addModifier(targets, pendingFinesse)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Centering Omamori", "Cleansing Omamori")
	.setModifiers({ name: "Finesse", stacks: 2 })
	.setProtection(50)
	.setCooldown(2);
