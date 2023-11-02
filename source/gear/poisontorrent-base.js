const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Poison Torrent",
	"Inflict @{mod0Stacks} @{mod0} on all foes",
	"@{mod0} x@{critBonus}",
	"Spell",
	"Water",
	200,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [poison], critBonus } = module.exports;
		targets.forEach(target => {
			addModifier(target, { name: "Poison", stacks: poison.stacks * (isCrit ? critBonus : 1) })
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
		})
		return `${targets.map(target => target.getName(adventure.room.enemyIdMap)).join(", ")} was Poisoned.`;
	})
).setTargetingTags({ target: "all", team: "enemy" })
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15);
