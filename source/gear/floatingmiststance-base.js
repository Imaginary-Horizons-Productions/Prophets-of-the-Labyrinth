const { GearTemplate } = require("../classes");
const { addModifier, removeModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Floating Mist Stance",
	"Enter a stance that increases Punch stagger by @{bonus} and grants @{mod1Stacks} @{mod1} each round (exit other stances)",
	"Gain @{mod1Stacks} @{mod1} now",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			addModifier(user, displayEvade);
		}
		removeModifier(user, { name: "Iron Fist Stance", stacks: "all", force: true });
		addModifier(user, floatingMistStance);
		return `${user.getName(adventure.room.enemyIdMap)} enters Floating Mist Stance${isCrit ? " and prepares to Evade" : ""}.`;
	}
).setUpgrades("Soothing Floating Mist Stance")
	.setTargetingTags({ target: "self", team: "self" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }])
	.setBonus(2) // Punch stagger boost
	.setDurability(10);
