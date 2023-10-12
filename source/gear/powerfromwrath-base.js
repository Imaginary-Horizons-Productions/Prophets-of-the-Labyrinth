const { GearTemplate } = require('../classes');
const { addModifier, payHP, dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Power from Wrath",
	"Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing hp)",
	"Damage x@{critBonus}",
	"Pact",
	"Darkness",
	200,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, hpCost } = module.exports;
		const furiousness = (user.maxHP - user.hp) / user.maxHP + 1;
		let pendingDamage = damage * furiousness;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			pendingDamage *= 2;
		}
		return `${payHP(user, hpCost, adventure)}${dealDamage([target], user, pendingDamage, false, element, adventure)}`;
	}
).setTargetingTags({ target: "single", team: "enemy" })
	.setModifiers({ name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setHPCost(40)
	.setDamage(75);
