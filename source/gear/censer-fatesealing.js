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
		const { element, modifiers: [slow, stasis], damage, bonus } = module.exports;
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
			const addedStasis = addModifier(target, stasis);
			if (addedSlow) {
				return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Slowed and enters Stasis.`;
			} else if (addedStasis) {
				return `${damageText} ${target.getName(adventure.room.enemyIdMap)} enters Stasis.`;
			}
		}
		return damageText;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Thick Censer", "Tormenting Censor")
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "Stasis", stacks: 1 })
	.setDamage(15)
	.setBonus(75) // damage
	.setDurability(15);
