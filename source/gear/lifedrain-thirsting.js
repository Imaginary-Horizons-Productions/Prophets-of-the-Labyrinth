const { GearTemplate } = require('../classes/index.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp (+@{bonus} on kill)",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, healing, critMultiplier, bonus } = module.exports;
		const targetsLivingAtMoveStart = targets.filter(target => target.hp > 0);
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targetsLivingAtMoveStart, "elementMatchFoe");
		}
		let damageText = dealDamage(targetsLivingAtMoveStart, user, pendingDamage, false, element, adventure);
		const bonusHealing = targetsLivingAtMoveStart.reduce((count, target) => target.hp < 1 ? count + 1 : count, 0) * bonus;
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		return `${damageText} ${gainHealth(user, pendingHealing + bonusHealing, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Life Drain", "Hunter's Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25)
	.setBonus(60);
