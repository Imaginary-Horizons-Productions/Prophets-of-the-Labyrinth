const { GearTemplate } = require('../classes');
const { addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Fate-Sealing Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0}",
	"HP Cost / @{critMultiplier} and grant @{mod1Stacks} @{mod1}",
	"Pact",
	"Light",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [regen, stasis], hpCost, critMultiplier } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			hpCost /= critMultiplier;
			addModifier(target, stasis);
		}
		addModifier(target, regen);
		return `${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} gains Regen${isCrit ? " and enters Stasis" : ""}.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Discounted Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 3 }, { name: "Stasis", stacks: 1 })
	.setHPCost(50)
	.setDurability(10);
