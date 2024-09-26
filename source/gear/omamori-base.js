const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const gainedEffects = ["protection"];
		const addedLucky = user.getModifierStacks("Oblivious") < 1;
		addModifier([user], pendingLucky);
		if (addedLucky) {
			gainedEffects.push(getApplicationEmojiMarkdown("Lucky"));
		}
		return [`${user.name} gains ${listifyEN(gainedEffects)}.`];
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: true })
	.setUpgrades("Centering Omamori", "Cleansing Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setDurability(10);
