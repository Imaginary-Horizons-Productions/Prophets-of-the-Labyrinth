const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage",
	"Also apply @{mod1Stacks} @{mod1}",
	"Trinket",
	"Fire",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, slow], damage, bonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			damage += bonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			addModifier(target, slow);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
		} else {
			return damageText;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setUpgrades("Fate-Sealing Censer", "Thick Censer", "Tormenting Censor")
	.setModifiers({ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 })
	.setDamage(50)
	.setBonus(75) // damage
	.setDurability(15);
