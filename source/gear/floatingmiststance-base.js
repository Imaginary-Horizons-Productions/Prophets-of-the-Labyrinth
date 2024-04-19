const { GearTemplate } = require("../classes");
const { addModifier, removeModifier, changeStagger, getNames } = require("../util/combatantUtil");

module.exports = new GearTemplate("Floating Mist Stance",
	"Enter a stance that increases Punch stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round (exit other stances)",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		let addedEvade = false;
		if (isCrit) {
			addedEvade = addModifier([user], displayEvade).length > 0;
		}
		removeModifier([user], { name: "Iron Fist Stance", stacks: "all", force: true });
		const addedFloatingMistStance = addModifier([user], floatingMistStance).length > 0;
		if (addedFloatingMistStance) {
			return `${getNames([user], adventure)[0]} enters Floating Mist Stance${addedEvade ? " and prepares to Evade" : ""}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setUpgrades("Soothing Floating Mist Stance")
	.setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 })
	.setBonus(2) // Punch stagger boost
	.setDurability(10);
