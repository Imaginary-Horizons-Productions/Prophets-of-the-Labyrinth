const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addBlock, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Scutum",
	"Grant @{block} block to all allies (including yourself)",
	"Block x@{critBonus}",
	"Armor",
	"Fire",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(user, block);
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		targets.forEach(target => {
			if (user.element === element) {
				removeModifier(target, elementStagger);
			}
			addBlock(target, block);
		})
		return "Damage will be blocked for everyone.";
	})
).setTargetingTags({ target: "all", team: "delver" })
	.setSidegrades("Guarding Scutum", "Vigilant Scutum")
	.setModifiers({ name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setBlock(75);
