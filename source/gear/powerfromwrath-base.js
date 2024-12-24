const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Power from Wrath",
	[
		["use", "Strike a foe for <@{damage} x 1 to 2 based on your missing HP> @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	200,
	(targets, user, adventure) => {
		const { essence, damage, pactCost: [pactCostValue] } = module.exports;
		const resultLines = [payHP(user, pactCostValue, adventure)];
		if (adventure.lives > 0) {
			const furiousness = 2 - user.hp / user.getMaxHP();
			let pendingDamage = (user.getPower() + damage) * furiousness;
			if (user.essence === essence) {
				changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
			}
			if (user.crit) {
				pendingDamage *= 2;
			}
			resultLines.push(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setUpgrades("Bashing Power from Wrath", "Hunter's Power from Wrath", "Staggering Power from Wrath")
	.setPactCost([40, "@{pactCost} HP"])
	.setDamage(40);
