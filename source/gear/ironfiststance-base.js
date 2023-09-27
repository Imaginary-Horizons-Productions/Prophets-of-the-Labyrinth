const { GearTemplate } = require("../classes");
const { addModifier, removeModifier } = require("../util/combatantUtil");

module.exports = new GearTemplate("Iron Fist Stance",
	"Increase Punch damage by @{bonus} and change its type to yours (exit other stances)",
	"Gain @{mod2Stacks} @{mod2}",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, ironFistStance, powerUp] } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			addModifier(user, powerUp);
		}
		removeModifier(user, { name: "Floating Mist Stance", stacks: "all", force: true });
		addModifier(user, ironFistStance);
		return `${user.getName(adventure.room.enemyIdMap)} enters Iron Fist Stance${isCrit ? " and is Powered Up" : ""}.`;
	}
).setTargetingTags({ target: "self", team: "self" })
	.setUpgrades("Organic Iron Fist Stance")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Iron Fist Stance", stacks: 1 }, { name: "Power Up", stacks: 25 }])
	.setBonus(45) // Punch damage boost
	.setDurability(10);
