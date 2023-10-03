const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants.js');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Double Firecracker",
	"Strike 6 random foes for @{damage} @{element} damage",
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
				return dealDamage([target], user, damage, false, element, adventure);
			})
		).then(results => results.filter(result => Boolean(result)).join(" "));
	})
).setTargetingTags({ target: `random${SAFE_DELIMITER}6`, team: "enemy" })
	.setSidegrades("Mercurial Firecracker", "Toxic Firecracker")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setCritBonus(2)
	.setDamage(50);
