const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Scutum",
	"Grant @{block} block to all allies (including yourself)",
	"Block x@{critBonus}",
	"Armor",
	"Fire",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, block, critBonus } = module.exports;
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(user, block);
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		targets.forEach(target => {
			if (user.element === element) {
				target.addStagger("elementMatchAlly");
			}
			addBlock(target, block);
		})
		return "Damage will be blocked for everyone.";
	})
).setTargetingTags({ target: "all", team: "delver" })
	.setSidegrades("Guarding Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(75);
