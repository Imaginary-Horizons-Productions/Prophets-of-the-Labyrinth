const { GearTemplate } = require('../classes');
const { addBlock } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Vigilant Scutum",
	"Grant @{block} block to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Block x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance], block, critMultiplier } = module.exports;
		let pendingBlock = block;
		if (user.element === element) {
			target.addStagger("elementMatchAlly");
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingBlock *= critMultiplier;
		}
		addBlock(target, pendingBlock);
		addBlock(user, pendingBlock);
		const addedVigilance = addModifier(user, vigilance);
		const userName = user.getName(adventure.room.enemyIdMap);
		return `Damage will be blocked for ${target.getName(adventure.room.enemyIdMap)} and ${userName}.${addedVigilance ? ` ${userName} gains Vigilance.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Sweeping Scutum")
	.setModifiers({ name: "Vigilance", stacks: 1 })
	.setDurability(15)
	.setBlock(75);
