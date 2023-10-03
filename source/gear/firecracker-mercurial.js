const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { needsLivingTargets } = require('../shared/actionComponents');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Mercurial Firecracker",
	"Strike 3 random foes for @{damage} damage matching the user's element",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], damage, critBonus } = module.exports;
		if (isCrit) {
			damage *= critBonus;
		}
		return Promise.all(
			targets.map(target => {
				if (user.element === element) {
					addModifier(target, elementStagger);
				}
				return dealDamage([target], user, damage, false, user.element, adventure);
			})
		).then(results => results.filter(result => Boolean(result)).join(" "));
	})
).setTargetingTags({ target: `random${SAFE_DELIMITER}3`, team: "enemy" })
	.setSidegrades("Double Firecracker", "Toxic Firecracker")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setCritBonus(2)
	.setDamage(50);
