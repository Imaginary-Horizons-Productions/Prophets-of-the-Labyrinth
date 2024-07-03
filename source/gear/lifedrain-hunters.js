const { GearTemplate } = require('../classes/index.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Life Drain",
	"Strike a foe for @{damage} @{element} damage, then gain @{healing} hp (@{bonus}g on kill)",
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
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		let damageText = `${dealDamage(targetsLivingAtMoveStart, user, pendingDamage, false, element, adventure)} ${gainHealth(user, pendingHealing, adventure)}`;
		const bounty = targetsLivingAtMoveStart.reduce((count, target) => target.hp < 1 ? count + 1 : count, 0) * bonus;
		if (bounty > 0) {
			adventure.gainGold(bounty);
			damageText += ` ${getNames([user], adventure)[0]} gains ${bounty}g of victory spoils.`;
		}
		return damageText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Life Drain", "Thirsting Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25)
	.setBonus(30); // gold
