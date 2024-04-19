const { GearTemplate } = require("../classes");
const { addModifier, removeModifier, changeStagger, getNames } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Iron Fist Stance",
	"Increase Punch damage by @{bonus} and change its type to yours (exit other stances)",
	"Inflict @{mod1Stacks} @{mod1} on all enemies",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const frailedTargets = [];
		if (isCrit) {
			const foeTeam = (user.team === "delver" ? adventure.room.enemies : adventure.delvers).filter(foe => foe.hp > 0);
			frailedTargets.concat(getNames(addModifier(foeTeam, frail), adventure));
		}
		removeModifier([user], { name: "Floating Mist Stance", stacks: "all", force: true });
		const ironFistStanceAdded = addModifier([user], ironFistStance).length > 0;
		if (ironFistStanceAdded) {
			return `${getNames([user], adventure)} enters Iron Fist Stance.${frailedTargets.length > 0 ? ` ${joinAsStatement(false, frailedTargets, "becomes", "become", "Frail.")}` : ""}`;
		} else if (frailedTargets.length > 0) {
			return joinAsStatement(false, frailedTargets, "becomes", "become", "Frail.");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setUpgrades("Organic Iron Fist Stance")
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setDurability(10);
