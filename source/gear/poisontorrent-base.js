const { GearTemplate } = require('../classes');
const { addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Poison Torrent",
	"Inflict @{mod0Stacks} @{mod0} on all foes",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [poison], critMultiplier } = module.exports;
		targets.forEach(target => {
			addModifier(target, { name: "Poison", stacks: poison.stacks * (isCrit ? critMultiplier : 1) })
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
		})
		return `${targets.map(target => target.getName(adventure.room.enemyIdMap)).join(", ")} was Poisoned.`;
	}
).setTargetingTags({ target: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDurability(15);
