const { GearTemplate } = require("../classes");
const { addModifier, removeModifier, changeStagger, getNames } = require("../util/combatantUtil");

module.exports = new GearTemplate("Soothing Floating Mist Stance",
	"Enter a stance that increases Punch stagger by @{bonus} and grants @{mod0Stacks} @{mod0} each round (exit other stances), gain @{mod1Stacks} @{mod1} now",
	"Gain @{mod0Stacks} @{mod0} now",
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [displayEvade, floatingMistStance, regen] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		let addedEvade = false;
		if (isCrit) {
			addedEvade = addModifier([user], displayEvade).length > 0;
		}
		removeModifier([user], { name: "Iron Fist Stance", stacks: "all", force: true });
		const addedFloatingMistStance = addModifier([user], floatingMistStance).length > 0;
		const addedRegen = addModifier([user], regen).length > 0;
		if (addedFloatingMistStance) {
			if (addedEvade) {
				return `${getNames([user], adventure)[0]} enters Floating Mist Stance, gains Regen, and prepares to Evade.`;
			} else {
				return `${getNames([user], adventure)[0]} enters Floating Mist Stance and gains Regen.`;
			}
		} else if (addedRegen) {
			return `${getNames([user], adventure)[0]} gains Regen${addedEvade ? " and prepares to Evade" : ""}.`;
		} else if (addedEvade) {
			return `${getNames([user], adventure)[0]} prepares to Evade.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setModifiers({ name: "Evade", stacks: 2 }, { name: "Floating Mist Stance", stacks: 1 }, { name: "Regen", stacks: 2 })
	.setBonus(2) // Punch stagger boost
	.setDurability(10);
