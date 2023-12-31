const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Scutum",
	"Grant @{block} block to all allies (including yourself)",
	"Block x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, block, critMultiplier } = module.exports;
		let pendingBlock = block;
		if (isCrit) {
			pendingBlock *= critMultiplier;
		}
		addBlock(user, pendingBlock);
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		targets.forEach(target => {
			if (user.element === element) {
				target.addStagger("elementMatchAlly");
			}
			addBlock(target, pendingBlock);
		})
		return "Damage will be blocked for everyone.";
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Vigilant Scutum")
	.setDurability(15)
	.setBlock(75);
