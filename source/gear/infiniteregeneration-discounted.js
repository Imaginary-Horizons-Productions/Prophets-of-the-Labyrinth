const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { removeModifier, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Discounted Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod1Stacks} @{mod1}",
	"HP Cost / @{critBonus}",
	"Pact",
	"Light",
	100,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, regen], hpCost, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		if (isCrit) {
			hpCost /= critBonus;
		}
		addModifier(target, regen);
		return `${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} gains Regen.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Fate-Sealing Infinite Regeneration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Regen", stacks: 3 }])
	.setHPCost(50)
	.setDurability(10);
