const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { addBlock, removeModifier, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Cleansing Barrier",
	"Gain @{block} block and @{mod0Stacks} @{mod0} and cure a random debuff",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [vigilance], block, critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedVigilance = addModifier(user, pendingVigilance);
		addBlock(user, block);
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		let debuffWasRemoved = false;
		let rolledDebuff;
		if (userDebuffs.length > 0) {
			rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			debuffWasRemoved = removeModifier(user, { name: rolledDebuff, stacks: "all" });
		}
		return `${user.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Block${debuffWasRemoved ? ` and shrugs off ${rolledDebuff}` : ""}.`;
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Devoted Barrier", "Long Barrier")
	.setModifiers({ name: "Vigilance", stacks: 1 })
	.setDurability(5)
	.setBlock(999);
