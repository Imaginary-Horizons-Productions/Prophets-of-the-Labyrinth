const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Reaper's Life Drain",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and execute them if they end below half your damage cap, then regain @{healing} HP"],
		["Critical💥", "Healing x @{critMultiplier}"]
	],
	"Action",
	"Darkness",
	0,
	([target], user, adventure) => {
		const { essence, healing, critMultiplier } = module.exports;
		let pendingHealing = healing;
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = dealDamage([target], user, user.getPower(), false, essence, adventure);
		if (target.hp > (user.getDamageCap() / 2)) {
			target.hp = 0;
			const { extraLines } = downedCheck(target, adventure);
			return [`${target.name} meets the reaper!`].concat(extraLines, gainHealth(user, pendingHealing, adventure));
		} else {
			changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
			return resultLines.concat(gainHealth(user, pendingHealing, adventure));
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setHealing(25);
