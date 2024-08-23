const { GearTemplate } = require("../classes");
const { addModifier, removeModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Agile Floating Mist Stance",
	"Enter a stance that increases Punch stagger by 2 and grants @{mod0Stacks} @{mod0} each round (exit other stances), then gain @{mod2Stacks} @{mod2}",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance, agility] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		removeModifier([user], { name: "Iron Fist Stance", stacks: "all", force: true });
		const resultFragments = [];
		const addedAgility = addModifier([user], agility).length > 0;
		if (addedAgility) {
			resultFragments.push("gains Agility");
		}
		const addedFloatingMistStance = addModifier([user], floatingMistStance).length > 0;
		if (addedFloatingMistStance) {
			resultFragments.push("enters Floating Mist Stance")
		}
		if (isCrit) {
			const addedEvade = addModifier([user], displayEvade).length > 0;
			if (addedEvade) {
				resultFragments.push("prepares to Evade");
			}
		}
		if (resultFragments.length > 0) {
			return `${getNames([user], adventure)[0]} ${listifyEN(resultFragments)}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setSidegrades("Soothing Floating Mist Stance")
	.setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Agility", stacks: 2 })
	.setDurability(10);
