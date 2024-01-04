const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage",
	"Also apply @{mod0Stacks} @{mod0}",
	"Trinket",
	"Fire",
	200,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			pendingDamage += bonus;
		}
		const damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			const addedSlow = addModifier(target, slow);
			return `${damageText}${addedSlow ? ` ${target.getName(adventure.room.enemyIdMap)} is Slowed.` : ""}`;
		} else {
			return damageText;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Fate-Sealing Censer", "Thick Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);
