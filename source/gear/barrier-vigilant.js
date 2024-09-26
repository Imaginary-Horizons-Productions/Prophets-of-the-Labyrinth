const { GearTemplate } = require('../classes/index.js');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Vigilant Barrier",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod1} x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedModifiers = [];
		const addedVigilance = addModifier([user], pendingVigilance).length > 0;
		if (addedVigilance) {
			addedModifiers.push("Vigilance");
		}
		const addedEvade = addModifier([user], evade).length > 0;
		if (addedEvade) {
			addedModifiers.push("Evade");
		}
		if (addedModifiers.length > 0) {
			return [`${user.name} gains ${listifyEN(addedModifiers)}.`];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setSidegrades("Cleansing Barrier", "Devoted Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 2 })
	.setDurability(5);
