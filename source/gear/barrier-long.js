const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Long Barrier",
	"Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance, critVigilance] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const addedModifiers = [];
		const addedVigilance = addModifier([user], isCrit ? critVigilance : vigilance).length > 0;
		if (addedVigilance) {
			addedModifiers.push("Vigilance");
		}
		const addedEvade = addModifier([user], evade).length > 0;
		if (addedEvade) {
			addedModifiers.push("Evade");
		}
		if (addedModifiers.length > 0) {
			return `${getNames([user], adventure)[0]} gains ${listifyEN(addedModifiers)}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Cleansing Barrier", "Devoted Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 2 }, { name: "Vigilance", stacks: 4 })
	.setDurability(5);
