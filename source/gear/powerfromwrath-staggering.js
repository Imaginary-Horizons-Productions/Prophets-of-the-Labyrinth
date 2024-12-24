const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Staggering Power from Wrath",
	[
		["use", "Strike a foe for <@{damage} x 1 to 2 based on your missing HP> @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, pactCost: [pactCostValue], stagger } = module.exports;
		const resultLines = [payHP(user, pactCostValue, adventure)];
		if (adventure.lives > 0) {
			const furiousness = 2 - user.hp / user.getMaxHP();
			let pendingDamage = (user.getPower() + damage) * furiousness;
			let pendingStagger = stagger;
			if (user.crit) {
				pendingDamage *= 2;
			}
			resultLines.push(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
			const stillLivingTargets = targets.filter(target => target.hp > 0);
			if (stillLivingTargets.length > 0) {
				if (user.essence === essence) {
					pendingStagger += ESSENCE_MATCH_STAGGER_FOE;
				}
				changeStagger(stillLivingTargets, user, pendingStagger);
				resultLines.push(joinAsStatement(false, stillLivingTargets.map(target => target.name), "was", "were", "Staggered."));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Bashing Power from Wrath", "Hunter's Power from Wrath")
	.setPactCost([40, "@{pactCost} HP"])
	.setDamage(40)
	.setStagger(2);
