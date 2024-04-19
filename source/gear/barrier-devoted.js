const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN, joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Devoted Barrier",
	"Grant an ally @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedModifiers = [];
		const addedVigilance = addModifier(targets, vigilance).length > 0;
		if (addedVigilance) {
			addedModifiers.push("Vigilance");
		}
		const addedEvade = addModifier(targets, evade).length > 0;
		if (addedEvade) {
			addedModifiers.push("Evade");
		}
		if (addedModifiers.length > 0) {
			return joinAsStatement(false, getNames(targets, adventure), "gains", "gain", `${listifyEN(addedModifiers)}.`);
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Barrier", "Long Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);
