const { GearTemplate } = require('../classes');
const { addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Discounted Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}",
	"HP Cost / @{critMultiplier}",
	"Pact",
	"Light",
	100,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [regen], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingHPCost /= critMultiplier;
		}
		const addedRegen = addModifier(target, regen);
		return `${payHP(user, pendingHPCost, adventure)}${addedRegen ? ` ${user.getName(adventure.room.enemyIdMap)} gains Regen.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setHPCost(50)
	.setDurability(10);
