const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

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
		const poisonedTargets = [];
		targets.map(target => {
			if (user.element === element) {
				target.addStagger("elementMatchFoe");
			}
			const addedPoison = addModifier(target, poison);
			if (addedPoison) {
				poisonedTargets.push(target.getName(adventure.room.enemyIdMap))
			}
		})

		if (poisonedTargets.length > 1) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${listifyEN(poisonedTargets)} are Poisoned.`;
		} else if (poisonedTargets.length === 1) {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)} ${poisonedTargets[0]} is Poisoned.`;
		} else {
			return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}`;
		}
	}
).setTargetingTags({ type: `random${SAFE_DELIMITER}3`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Double Firecracker", "Mercurial Firecracker")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(15);
