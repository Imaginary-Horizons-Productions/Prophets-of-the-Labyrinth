const { GearTemplate } = require('../classes');
// const { dealDamage, addModifier } = require('../combatantDAO.js');

module.exports = new GearTemplate("Accelerating Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod1Stacks} @{mod1}",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		if (target.hp < 1) {
			return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
		}

		let { element, modifiers: [elementStagger, quicken], damage, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		damage += powerUpStacks;
		if (isCrit) {
			damage *= critBonus;
			damage += powerUpStacks;
		}
		addModifier(user, quicken);
		return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
			return `${damageText} ${user.getName(adventure.room.enemyIdMap)} is Quickened.`;
		});
	}
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Piercing Lance", "Vigilant Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Quicken", stacks: 1 }])
	.setDurability(15)
	.setDamage(75);
