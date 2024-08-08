const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Toxic Firecracker",
	"Strike 3 random foes applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultsSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(stillLivingTargets, "elementMatchFoe");
			}
			const poisonedTargetNames = getNames(addModifier(stillLivingTargets, poison), adventure);
			if (poisonedTargetNames.length > 0) {
				resultsSentences.push(joinAsStatement(false, poisonedTargetNames, "is", "are", "Poisoned."));
			}
		}
		return resultsSentences.join(" ");
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Midas's Firecracker")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(5);
