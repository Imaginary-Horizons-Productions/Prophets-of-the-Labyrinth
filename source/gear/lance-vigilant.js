const { GearTemplate } = require('../classes');
// const { dealDamage, addModifier, addBlock } = require('../combatantDAO.js');

module.exports = new GearTemplate("Vigilant Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up), then gain @{mod1Stacks} @{mod1}",
	"Damage x@{critBonus}",
	"Weapon",
	"Earth",
	350,
	effect
)
	.setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Accelerating Lance", "Piercing Lance")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Vigilance", stacks: 2 }])
	.setDurability(15)
	.setDamage(75);

function effect([target], user, isCrit, adventure) {
	if (target.hp < 1) {
		return ` ${target.getName(adventure.room.enemyIdMap)} was already dead!`;
	}

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
}
