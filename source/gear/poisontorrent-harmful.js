const { GearTemplate } = require('../classes');
const { addModifier, dealDamage } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Harmful Poison Torrent",
	"Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on all foes",
	"@{mod0} x@{critMultiplier}",
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], critMultiplier, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingPoison = poison;
		if (isCrit) {
			pendingPoison.stacks *= critMultiplier;
		}
		const poisonedTargets = [];
		targets.forEach(target => {
			const addedPoison = addModifier(target, pendingPoison);
			if (addedPoison) {
				poisonedTargets.push(target.getName(adventure.room.enemyIdMap));
			}
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
		})
		if (poisonedTargets.length > 1) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${listifyEN(poisonedTargets)} were Poisoned.`;
		} else if (poisonedTargets === 1) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${poisonedTargets[0]} was Poisoned.`;
		} else {
			return dealDamage(targets, user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ target: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDamage(15)
	.setDurability(15);
