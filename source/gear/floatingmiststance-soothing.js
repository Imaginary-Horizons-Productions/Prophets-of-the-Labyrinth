const { GearTemplate } = require("../classes");
const { addModifier, removeModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Soothing Floating Mist Stance",
	"Enter a stance that increases Punch stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round (exit other stances), gain @{mod1Stacks} @{mod1} now",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [displayEvade, floatingMistStance, regen] } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			addModifier(user, displayEvade);
		}
		removeModifier(user, { name: "Iron Fist Stance", stacks: "all", force: true });
		addModifier(user, floatingMistStance);
		addModifier(user, regen);
		return `${user.getName(adventure.room.enemyIdMap)} enters Floating Mist Stance${isCrit ? " and prepares to Evade" : ""}.`;
	}
).setTargetingTags({ target: "self", team: "any" })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Regen", stacks: 2 })
	.setBonus(2) // Punch stagger boost
	.setDurability(10);
