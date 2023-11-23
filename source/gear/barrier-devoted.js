const { GearTemplate } = require('../classes');
const { addBlock, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Devoted Barrier",
	"Grant an ally @{block} block and @{mod0Stacks} @{mod0}",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance], block, critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedVigilance = addModifier(target, vigilance);
		addBlock(target, block);
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)}${addedVigilance ? " and they gain Vigilance" : ""}.`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Barrier", "Long Barrier")
	.setModifiers({ name: "Vigilance", stacks: 1 })
	.setDurability(5)
	.setBlock(999);
