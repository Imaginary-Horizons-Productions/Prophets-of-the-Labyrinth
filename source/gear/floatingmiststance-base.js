const { GearTemplate } = require("../classes");
const { addModifier, removeModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Floating Mist Stance",
	"Enter a stance that increases Punch stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round (exit other stances)",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [displayEvade, floatingMistStance] } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			addModifier(user, displayEvade);
		}
		removeModifier(user, { name: "Iron Fist Stance", stacks: "all", force: true });
		addModifier(user, floatingMistStance);
		return `${user.getName(adventure.room.enemyIdMap)} enters Floating Mist Stance${isCrit ? " and prepares to Evade" : ""}.`;
	}
).setUpgrades("Soothing Floating Mist Stance")
	.setTargetingTags({ target: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 })
	.setBonus(2) // Punch stagger boost
	.setDurability(10);
