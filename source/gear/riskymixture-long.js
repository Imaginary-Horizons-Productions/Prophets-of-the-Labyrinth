const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Long Risky Mixture",
	"Inflict @{mod0Stacks} @{mod0} on a target",
	"Apply @{mod1} instead of @{mod0}",
	"Trinket",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison, regen] } = module.exports;
		if (user.element === element) {
			if (target.team === user.team) {
				changeStagger([target], "elementMatchAlly");
			} else {
				changeStagger([target], "elementMatchFoe");
			}
		}
		if (isCrit) {
			const addedRegen = addModifier([target], regen).length > 0;
			if (addedRegen) {
				return `${target.getName(adventure.room.enemyIdMap)} gains Regen.`;
			} else {
				return "But nothing happened.";
			}
		} else {
			const addedPoison = addModifier([target], poison).length > 0;
			if (addedPoison) {
				return `${target.getName(adventure.room.enemyIdMap)} was Poisoned.`;
			} else {
				return "But nothing happened.";
			}
		}
	}
).setTargetingTags({ type: "single", team: "any", needsLivingTargets: true })
	.setModifiers({ name: "Poison", stacks: 6 }, { name: "Regen", stacks: 6 })
	.setDurability(15);
