const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Medicine",
	"Grant an ally @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critMultiplier}",
	"Trinket",
	"Water",
	200,
	([target], user, isCrit, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingRegen.stacks *= critMultiplier;
		}
		const addedRegen = addModifier(target, pendingRegen);
		if (addedRegen) {
			return `${target.getName(adventure.room.enemyIdMap)} gains Regen.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15);
