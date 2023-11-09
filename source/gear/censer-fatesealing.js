const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Fate-Sealing Censer",
	"Burn a foe for @{damage} (+@{bonus} if target has any debuffs) @{element} damage",
	"Also apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}",
	"Trinket",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [slow, stasis], damage, bonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (Object.keys(target.modifiers).some(modifier => isDebuff(modifier))) {
			damage += bonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (isCrit && target.hp > 0) {
			addModifier(target, slow);
			addModifier(target, stasis);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed and enters Stasis.`;
		} else {
			return damageText;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thick Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "Stasis", stacks: 1 })
	.setDamage(50)
	.setBonus(75) // damage
	.setDurability(15);
