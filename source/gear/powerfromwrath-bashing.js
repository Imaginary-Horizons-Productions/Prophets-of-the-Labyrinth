const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Bashing Power from Wrath",
	[
		["use", "Strike a foe for <(@{damage} + protection) x 1 to 2 based on your missing HP> @{element} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { element, damage, pactCost: [pactCostValue] } = module.exports;
		const resultLines = [payHP(user, pactCostValue, adventure)];
		if (adventure.lives > 0) {
			const furiousness = 2 - user.hp / user.getMaxHP();
			let pendingDamage = (user.getPower() + damage + user.protection) * furiousness;
			if (user.element === element) {
				changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
			}
			if (user.crit) {
				pendingDamage *= 2;
			}
			resultLines.push(...dealDamage(targets, user, pendingDamage, false, element, adventure));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Hunter's Power from Wrath", "Staggering Power from Wrath")
	.setPactCost([40, "@{pactCost} HP"])
	.setDamage(40);
