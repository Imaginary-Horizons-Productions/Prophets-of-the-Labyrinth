const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Life Drain",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and regain @{healing} HP"],
		["Critical💥", "Healing x @{critMultiplier}"]
	],
	"Action",
	"Darkness",
	0,
	(targets, user, adventure) => {
		const { essence, healing, critMultiplier } = module.exports;
		let pendingHealing = healing;
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, user.getPower(), false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(gainHealth(user, pendingHealing, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setHealing(25);
