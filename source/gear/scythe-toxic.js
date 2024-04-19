const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Toxic Scythe",
	"Strike a foe applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage; instant death if foe is at or below @{bonus} hp",
	"Instant death threshold x@{critMultiplier}",
	"Weapon",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison], damage, bonus: hpThreshold, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHPThreshold = hpThreshold;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingHPThreshold *= critMultiplier;
		}
		if (target.hp > pendingHPThreshold) {
			const addedPoison = addModifier([target], poison).length > 0;
			return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${addedPoison ? ` ${target.getName(adventure.room.enemyIdMap)} is Poisoned.` : ""}`;
		} else {
			target.hp = 0;
			return `${target.getName(adventure.room.enemyIdMap)} meets the reaper.`;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Scythe", "Unstoppable Scythe")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(40)
	.setBonus(99); // execute threshold
