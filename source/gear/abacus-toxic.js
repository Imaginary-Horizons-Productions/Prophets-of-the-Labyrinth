const { GearTemplate } = require('../classes/index.js');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Abacus",
	"Apply @{mod0Stacks} @{mod0} and @{damage} (+5% foe max hp) @{element} damage to a foe",
	"Damage x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage + (0.05 * target.getMaxHP());
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp > 0) {
			const addedPoison = addModifier(target, poison);
			if (addedPoison) {
				resultText += ` ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
			}
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Abacus", "Sharpened Abacus")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(40);
