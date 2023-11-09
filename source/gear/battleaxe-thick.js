const { GearTemplate } = require('../classes');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thick Battleaxe",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [exposed], damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		addModifier(user, exposed);
		return `${dealDamage([target], user, damage, false, element, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Exposed.`
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Prideful Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(30)
	.setDamage(125);
