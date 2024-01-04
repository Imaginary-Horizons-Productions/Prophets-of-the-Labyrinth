const { GearTemplate } = require("../classes");
const { addModifier, removeModifier } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new GearTemplate("Iron Fist Stance",
	"Increase Punch damage by @{bonus} and change its type to yours (exit other stances)",
	"Inflict @{mod1Stacks} @{mod1} on all enemies",
	"Technique",
	"Light",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		const frailedTargets = [];
		if (isCrit) {
			const foeTeam = user.team === "delver" ? adventure.room.enemies : adventure.delvers;
			foeTeam.forEach(foe => {
				if (foe.hp > 0) {
					const addedFrail = addModifier(foe, frail);
					if (addedFrail) {
						frailedTargets.push(foe.getName(adventure.room.enemyIdMap));
					}
				}
			})
		}
		removeModifier(user, { name: "Floating Mist Stance", stacks: "all", force: true });
		const ironFistStanceAdded = addModifier(user, ironFistStance);
		if (ironFistStanceAdded) {
			return `${user.getName(adventure.room.enemyIdMap)} enters Iron Fist Stance.${frailedTargets.length > 0 ? ` ${listifyEN(frailedTargets)} became Frail.` : ""}`;
		} else if (frailedTargets.length > 0) {
			return `${listifyEN(frailedTargets)} became Frail.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setUpgrades("Organic Iron Fist Stance")
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setDurability(10);
