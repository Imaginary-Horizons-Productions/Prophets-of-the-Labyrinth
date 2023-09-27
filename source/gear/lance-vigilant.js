const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../util/actionComponents');
const { dealDamage, addModifier, addBlock } = require('../util/combatantUtil');

module.exports = new GearTemplate("Vigilant Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod1Stacks} @{mod1}",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, vigilance], damage, block, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		damage += powerUpStacks;
		if (isCrit) {
			damage *= critBonus;
			damage += powerUpStacks;
		}
		addBlock(user, block);
		addModifier(user, vigilance);
		return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
			return `${damageText} ${user.getName(adventure.room.enemyIdMap)} gains Vigilance`;
		});
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Lance", "Piercing Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setDurability(15)
	.setDamage(75);
