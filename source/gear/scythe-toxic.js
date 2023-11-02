const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Scythe",
	"Strike a foe applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critBonus}",
	"Weapon",
	"Darkness",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [poison], damage, bonus: hpThreshold, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			hpThreshold *= critBonus;
		}
		if (target.hp > hpThreshold) {
			addModifier(target, poison);
			return `${dealDamage([target], user, damage, false, element, adventure)} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
		} else {
			target.hp = 0;
			return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Scythe", "Piercing Scythe")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(75)
	.setBonus(99); // execute threshold
