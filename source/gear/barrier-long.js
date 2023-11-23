const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Long Barrier",
	"Gain @{block} block and @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance, critVigilance], block } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		let addedVigilance = true;
		if (isCrit) {
			addedVigilance = addModifier(user, vigilance);
		} else {
			addedVigilance = addModifier(user, critVigilance);
		}
		addBlock(user, block);
		return `${user.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Block.`;
	}
).setTargetingTags({ target: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Cleansing Barrier", "Devoted Barrier")
	.setModifiers({ name: "Vigilance", stacks: 2 }, { name: "Vigilance", stacks: 4 })
	.setDurability(5)
	.setBlock(999);
