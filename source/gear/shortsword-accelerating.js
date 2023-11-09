const { GearTemplate } = require('../classes');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Accelerating Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to the foe and @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to yourself",
	"Damage x@{critBonus}",
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [exposed, quicken], damage, critBonus } = module.exports;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			damage *= critBonus;
		}
		const damageText = dealDamage([target], user, damage, false, element, adventure);
		addModifier(user, exposed);
		addModifier(user, quicken);
		addModifier(target, exposed);
		return `${damageText} ${target.getName(adventure.room.enemyIdMap)} is Exposed. ${user.getName(adventure.room.enemyIdMap)} is Quickened and Exposed.`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 }, { name: "Quicken", stacks: 1 })
	.setDurability(15)
	.setDamage(75);
