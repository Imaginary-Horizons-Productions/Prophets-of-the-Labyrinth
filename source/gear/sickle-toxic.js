const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Sickle",
	"Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} (+5% foe max hp) @{element} damage and apply",
	"Damage x@{critBonus}",
	"Weapon",
	"Water",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, poison], damage, critBonus } = module.exports;
		damage += (0.05 * target.maxHp);
		if (user.element === element) {
			addModifier(target, elementStagger);
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
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Hunter's Sickle", "Sharpened Sickle")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setDurability(15)
	.setDamage(75);
