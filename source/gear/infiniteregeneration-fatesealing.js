const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { removeModifier, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Fate-Sealing Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod1Stacks} @{mod1}",
	"HP Cost / @{critBonus} and grant @{mod2Stacks} @{mod2}",
	"Pact",
	"Light",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, regen, stasis], hpCost, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(target, elementStagger);
		}
		if (isCrit) {
			hpCost /= critBonus;
			addModifier(target, stasis);
		}
		addModifier(target, regen);
		return `${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} gains Regen${isCrit ? " and enters Stasis" : ""}.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Discounted Infinite Regeneration")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Regen", stacks: 3 }, { name: "Stasis", stacks: 1 }])
	.setHPCost(50)
	.setDurability(10);
