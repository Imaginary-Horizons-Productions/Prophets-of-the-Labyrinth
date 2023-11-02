const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Evasive Bow",
	"Strike a foe for @{damage} @{element} damage and gain @{mod0Stacks} @{mod0} with priority",
	"Damage x@{critBonus}",
	"Weapon",
	"Wind",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [evade], damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, evade);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is ready to Evade.`;
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Hunter's Bow", "Mercurial Bow")
	.setModifiers({ name: "Evade", stacks: 2 })
	.setDurability(15)
	.setDamage(75)
	.setPriority(1);
