const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Life Drain",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, then gain @{healing} HP (+@{bonus} on kill)"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, healing, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		pendingHealing += (targets.length - targets.filter(target => target.hp > 0).length) * bonus;
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		resultLines.push(gainHealth(user, pendingHealing, adventure));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Flanking Life Drain", "Furious Life Drain")
	.setCharges(15)
	.setDamage(40)
	.setHealing(25)
	.setBonus(60)
	.setCooldown(0);
