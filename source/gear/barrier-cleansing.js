const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { addBlock, removeModifier, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Cleansing Barrier",
	"Gain @{block} block and @{mod1Stacks} @{mod1} and cure a random debuff",
	"@{mod1} x@{critBonus}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance, critVigilance], block } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			addModifier(user, vigilance);
		} else {
			addModifier(user, critVigilance);
		}
		addBlock(user, block);
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		const debuffWasRemoved = userDebuffs.length > 0 && !("Stasis" in user.modifiers);
		let rolledDebuff;
		if (userDebuffs.length > 0) {
			rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			removeModifier(user, { name: rolledDebuff, stacks: "all" });
		}
		return `${user.getName(adventure.room.enemyIdMap)} Vigilantly prepares to Block${debuffWasRemoved ? ` and shrugs off ${rolledDebuff}` : ""}.`;
	}
).setTargetingTags({ target: "self", team: "any" })
	.setSidegrades("Devoted Barrier", "Long Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setDurability(5)
	.setBlock(999);
