const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Poison Torrent",
	"Inflict @{mod1Stacks} @{mod1} on all foes",
	"@{mod1} x@{critBonus}",
	"Spell",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, poison], critBonus } = module.exports;
		targets.forEach(target => {
			addModifier(target, { name: "Poison", stacks: poison.stacks * (isCrit ? critBonus : 1) })
			if (user.element === element) {
				addModifier(target, elementStagger);
			}
		})
		return `${targets.map(target => target.getName(adventure.room.enemyIdMap)).join(", ")} was Poisoned.`;
	}
).setTargetingTags({ target: "all", team: "enemy" })
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 2 }])
	.setDurability(15);
