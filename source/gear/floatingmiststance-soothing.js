const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Soothing Floating Mist Stance",
	"Enter a stance that increases Punch stagger by 2 and grants @{mod0Stacks} @{mod0} each round (exit other stances), gain @{mod1Stacks} @{mod1} now",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance, regen] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const resultFragments = [];
		const { didAddStance, stancesRemoved } = enterStance(user, floatingMistStance);
		if (stancesRemoved.length > 0) {
			resultFragments.push(`exits ${listifyEN(stancesRemoved, false)}`);
		}
		const addedRegen = addModifier([user], regen).length > 0;
		if (addedRegen) {
			resultFragments.push("gains Regen");
		}
		if (isCrit) {
			const addedEvade = addModifier([user], displayEvade).length > 0;
			if (addedEvade) {
				resultFragments.push("prepares to Evade");
			}
		}
		if (resultFragments.length > 0) {
			return `${getNames([user], adventure)[0]} ${listifyEN(resultFragments, false)}.`;
		} else if (didAddStance) {
			return "";
		} else {
			return "But nothing happened.";
		}
	}
).setSidegrades("Agile Floating Mist Stance")
	.setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Regen", stacks: 2 })
	.setDurability(10);
