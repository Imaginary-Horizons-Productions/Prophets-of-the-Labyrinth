const { GearTemplate } = require('../classes');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Sickle",
	"Strike a foe applying @{mod0Stacks} @{mod0} and @{damage} (+5% foe max hp) @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Water",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [poison], damage, critBonus } = module.exports;
		damage += (0.05 * target.maxHP);
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		let damageText = dealDamage([target], user, damage, false, element, adventure);
		if (target.hp > 0) {
			addModifier(target, poison);
			return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
		} else {
			return damageText;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Hunter's Sickle", "Sharpened Sickle")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(75);
