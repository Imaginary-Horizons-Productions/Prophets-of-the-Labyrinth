const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_ALLY } = require('../constants');
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
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection(targets, protection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")].concat(generateModifierResultLines(addModifier(targets, pendingLucky)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Centering Omamori", "Cleansing Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setDurability(10);
