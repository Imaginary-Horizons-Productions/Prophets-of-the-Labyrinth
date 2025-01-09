const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Furious Life Drain",
	[
		["use", "Deal <@{damage} x 1 to 1.5 based on your missing HP> @{essence} damage to a single foe and regain @{healing} HP"],
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
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		const resultLines = dealDamage(targets, user, user.getPower() * furiousness, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(gainHealth(user, pendingHealing, adventure));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setHealing(25);
