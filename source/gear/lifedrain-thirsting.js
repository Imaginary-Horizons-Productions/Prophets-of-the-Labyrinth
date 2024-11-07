const { GearTemplate } = require('../classes/index.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Life Drain",
	[
		["use", "Strike a foe for @{damage} @{element} damage, then gain @{healing} HP (+@{bonus} on kill)"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { element, damage, healing, critMultiplier, bonus } = module.exports;
		const targetsLivingAtMoveStart = targets.filter(target => target.hp > 0);
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targetsLivingAtMoveStart, "elementMatchFoe");
		}
		const resultLines = dealDamage(targetsLivingAtMoveStart, user, pendingDamage, false, element, adventure);
		pendingHealing += targetsLivingAtMoveStart.reduce((count, target) => target.hp < 1 ? count + 1 : count, 0) * bonus;
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		resultLines.push(gainHealth(user, pendingHealing, adventure));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Flanking Life Drain", "Furious Life Drain")
	.setDurability(15)
	.setDamage(40)
	.setHealing(25)
	.setBonus(60);
