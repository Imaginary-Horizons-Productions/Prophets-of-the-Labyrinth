const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Devoted Barrier",
	"Grant an ally @{block} block and @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critBonus}",
	"Spell",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [vigilance, critVigilance], block } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			addModifier(target, vigilance);
		} else {
			addModifier(target, critVigilance);
		}
		addBlock(target, block);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)} and they gain Vigilance.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Cleansing Barrier", "Long Barrier")
	.setModifiers({ name: "Vigilance", stacks: 1 }, { name: "Vigilance", stacks: 2 })
	.setDurability(5)
	.setBlock(999);
