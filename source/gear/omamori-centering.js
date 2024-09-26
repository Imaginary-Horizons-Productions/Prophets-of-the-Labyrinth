const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Centering Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier, stagger } = module.exports;
		const hadStagger = user.stagger > 0;
		changeStagger([user], stagger);
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const gainedEffects = ["protection"];
		const addedLucky = addModifier([user], pendingLucky).length > 0;
		if (addedLucky) {
			gainedEffects.push(getApplicationEmojiMarkdown("Lucky"));
		}
		const userEffects = [];
		if (gainedEffects.length > 0) {
			userEffects.push(`gains ${listifyEN(gainedEffects)}`);
		}
		if (hadStagger) {
			userEffects.push("shrugs off some Stagger");
		}
		return [`${user.name} ${listifyEN(userEffects)}.`];
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setStagger(-2)
	.setDurability(10);
