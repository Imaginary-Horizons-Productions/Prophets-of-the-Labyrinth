const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock, removeModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Purifying Barrier",
	"Grant an ally @{block} block and cure them of all debuffs",
	"Block x@{critBonus}",
	"Spell",
	"Light",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(target, block);
		const debuffs = [];
		for (let modifier in target.modifiers) {
			if (isDebuff(modifier)) {
				delete target.modifiers[modifier];
				debuffs.push(modifier);
			}
		}
		return `Damage will be Blocked for ${target.getName(adventure.room.enemyIdMap)} and they are relieved of ${debuffs.join(", ")}.`;
	})
).setTargetingTags({ target: "single", team: "delver" })
	.setSidegrades("Thick Barrier", "Urgent Barrier")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(5);
