const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Devoted Floating Mist Stance",
	[
		["use", "Give an ally @{mod1Stacks} @{mod1} (exit other stances)"],
		["Critical💥", "Also give @{mod0Stacks} @{mod0}"]
	],
	"Technique",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([target], "elementMatchAlly");
		}
		const resultFragments = [];
		const { didAddStance, stancesRemoved } = enterStance(target, floatingMistStance);
		if (stancesRemoved.length > 0) {
			resultFragments.push(`exits ${listifyEN(stancesRemoved, false)}`);
		}
		if (isCrit) {
			const addedEvade = addModifier([target], displayEvade).length > 0;
			if (addedEvade) {
				resultFragments.push("prepares to Evade");
			}
		}
		if (resultFragments.length > 0) {
			return `${getNames([target], adventure)[0]} ${listifyEN(resultFragments)}.`;
		} else if (didAddStance) {
			return "";
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: false })
	.setSidegrades("Agile Floating Mist Stance", "Soothing Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
