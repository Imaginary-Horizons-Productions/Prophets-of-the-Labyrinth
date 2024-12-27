const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { payHP, dealDamage, changeStagger, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Hunter's Power from Wrath",
	[
		["use", "Strike a foe for <@{damage} x 1 to 2 based on your missing HP> @{essence} damage"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, damage, pactCost: [pactCostValue], modifiers: [empowerment] } = module.exports;
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
			const stillLivingTargets = targets.filter(target => target.hp > 0);
			if (stillLivingTargets.length < targets.length) {
				resultLines.push(...generateModifierResultLines(addModifier([user], empowerment)));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Bashing Power from Wrath", "Staggering Power from Wrath")
	.setPactCost([40, "@{pactCost} HP"])
	.setDamage(40)
	.setModifiers({ name: "Empowerment", stacks: 15 })
	.setCooldown(0);
