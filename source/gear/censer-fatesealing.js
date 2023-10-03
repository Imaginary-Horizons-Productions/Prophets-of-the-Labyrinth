const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Fate-Sealing Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage",
	"Also apply @{mod1Stacks} @{mod1} and @{mod2Stacks} @{mod2}",
	"Trinket",
	"Fire",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, slow, stasis], damage, bonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			damage += bonus;
		}
		return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
			if (isCrit && target.hp > 0) {
				addModifier(target, slow);
				addModifier(target, stasis);
				return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed and enters Stasis.`;
			} else {
				return damageText;
			}
		});
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Thick Censer", "Tormenting Censor")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Slow", stacks: 2 }, { name: "Stasis", stacks: 1 }])
	.setDamage(50)
	.setBonus(75) // damage
	.setDurability(15);
