const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Midas Staff",
	"Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to a combatant",
	"@{mod0} +@{bonus}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [curse, regen], bonus } = module.exports;
		const pendingCurse = { ...curse };
		if (isCrit) {
			pendingCurse.stacks += bonus;
		}
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		const addedCurse = addModifier([target], pendingCurse).length > 0;
		const addedRegen = addModifier([target], regen).length > 0;
		if (addedCurse) {
			return `${target.getName(adventure.room.enemyIdMap)} gains Curse of Midas${addedRegen ? ` and Regen` : ""}.`;
		} else if (addedRegen) {
			return `${target.getName(adventure.room.enemyIdMap)} gains Regen.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setSidegrades("Accelerating Midas Staff", "Discounted Midas Staff")
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Regen", stacks: 2 })
	.setBonus(1) // Curse of Midas stacks
	.setDurability(10);
