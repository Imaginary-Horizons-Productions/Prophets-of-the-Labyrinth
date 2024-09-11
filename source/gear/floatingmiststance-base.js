const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Floating Mist Stance",
	"Enter a stance that increases Punch stagger by 2 and grants @{mod0Stacks} @{mod0} each round (exit other stances)",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const resultFragments = [];
		const { didAddStance, stancesRemoved } = enterStance(user, floatingMistStance);
		if (stancesRemoved.length > 0) {
			resultFragments.push(`exits ${listifyEN(stancesRemoved, false)}`);
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
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setUpgrades("Agile Floating Mist Stance", "Devoted Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
