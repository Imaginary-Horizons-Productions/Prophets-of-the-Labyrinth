const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

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
		const poisonedTargets = getNames(addModifier(targets, pendingPoison), adventure);
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (poisonedTargets.length > 0) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${joinAsStatement(false, poisonedTargets, "is", "are", "Poisoned.")}`;
		} else {
			return dealDamage(targets, user, pendingDamage, false, element, adventure);
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setModifiers({ name: "Poison", stacks: 2 })
	.setDamage(15)
	.setDurability(15);
