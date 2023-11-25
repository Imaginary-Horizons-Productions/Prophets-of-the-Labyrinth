const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, gainHealth } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Battleaxe",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; heal @{healing} hp on kill",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier, healing } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedExposed = addModifier(user, exposed);
		let damageText = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp < 1) {
			damageText += gainHealth(user, healing, adventure);
		}
		return `${damageText}${addedExposed ? ` ${user.getName(adventure.room.enemyIdMap)} is Exposed.` : ""}`;
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Prideful Battleaxe", "Thick Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90)
	.setHealing(60);
