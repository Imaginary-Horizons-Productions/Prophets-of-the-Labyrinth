const { GearTemplate } = require('../classes');
const { addModifier, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Harmful Poison Torrent",
	"Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on all foes",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		let { element, modifiers: [poison], critMultiplier, damage } = module.exports;
		targets.forEach(target => {
			addModifier(target, { name: "Poison", stacks: poison.stacks * (isCrit ? critMultiplier : 1) })
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
		})
		return `${dealDamage(targets, user, damage, false, element, adventure)} ${targets.map(target => `**${target.getName(adventure.room.enemyIdMap)}**`).join(", ")} ${targets.length === 1 ? "was" : "were"} Poisoned.`;
	}
).setTargetingTags({ target: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDamage(50)
	.setDurability(15);
