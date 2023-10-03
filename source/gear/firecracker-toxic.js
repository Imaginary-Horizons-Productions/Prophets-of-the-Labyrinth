const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Firecracker",
	"Strike 3 random foes applying @{mod1Stacks} @{mod1} and @{damage} @{element} damage",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger, poison], damage, critBonus } = module.exports;
		if (isCrit) {
			damage *= critBonus;
		}
		return Promise.all(
			targets.map(target => {
				if (user.element === element) {
					addModifier(target, elementStagger);
				}
				addModifier(target, poison);
				return dealDamage([target], user, damage, false, element, adventure).then(damageText => {
					return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
				});
			})
		).then(results => results.filter(result => Boolean(result)).join(" "));
	})
).setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setSidegrades("Double Firecracker", "Mercurial Firecracker")
	.setModifiers([{ name: "Stagger", stacks: 1 }, { name: "Poison", stacks: 3 }])
	.setDurability(15)
	.setCritBonus(2)
	.setDamage(50);
