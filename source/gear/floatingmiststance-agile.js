const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
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
		const resultFragments = [];
		const { didAddStance, stancesRemoved } = enterStance(user, floatingMistStance);
		if (stancesRemoved.length > 0) {
			resultFragments.push(`exits ${listifyEN(stancesRemoved, false)}`);
		}
		const addedAgility = addModifier([user], agility).length > 0;
		if (addedAgility) {
			resultFragments.push("gains Agility");
		}
		if (isCrit) {
			const addedEvade = addModifier([user], displayEvade).length > 0;
			if (addedEvade) {
				resultFragments.push("prepares to Evade");
			}
		}
		if (resultFragments.length > 0) {
			return `${getNames([user], adventure)[0]} ${listifyEN(resultFragments)}.`;
		} else if (didAddStance) {
			return "";
		} else {
			return "But nothing happened.";
		}
	}
).setSidegrades("Soothing Floating Mist Stance")
	.setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Agility", stacks: 2 })
	.setDurability(10);
