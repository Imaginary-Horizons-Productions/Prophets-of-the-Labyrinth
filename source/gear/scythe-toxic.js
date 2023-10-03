const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents');
const { addModifier, dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Scythe",
	"Strike a foe applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critBonus}",
	"Weapon",
	"Darkness",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, poison], damage, bonus: hpThreshold, critBonus } = module.exports;
		if (user.element === element) {
			addModifier(target, elementStagger);
		}
		if (isCrit) {
			hpThreshold *= critBonus;
		}
		if (target.hp > hpThreshold) {
			addModifier(target, poison);
			return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
				return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
			});
		} else {
			target.hp = 0;
			return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Lethal Scythe", "Piercing Scythe")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setDurability(15)
	.setDamage(75)
	.setBonus(99); // execute threshold
