const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Soothing Floating Mist Stance",
	[
		["use", "Gain @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2} (exit other stances)"],
		["Critical💥", "Gain @{mod0Stacks} @{mod0}"]
	],
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
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setSidegrades("Agile Floating Mist Stance", "Devoted Floating Mist Stance")
	.setModifiers({ name: "Evade", stacks: 1 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Regen", stacks: 2 })
	.setDurability(10)
	.setBonus(3) // Punch Stagger
	.setFlavorText({ name: "Floating Mist Stance", value: "Each stack increases Punch Stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round" });
