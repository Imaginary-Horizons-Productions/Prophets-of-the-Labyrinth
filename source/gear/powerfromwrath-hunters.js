const { GearTemplate } = require('../classes');
const { payHP, dealDamage, changeStagger, generateModifierResultLines } = require('../util/combatantUtil');

module.exports = new GearTemplate("Hunter's Power from Wrath",
	[
		["use", "Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing HP)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, hpCost, modifiers: [powerUp] } = module.exports;
		const resultLines = [payHP(user, hpCost, adventure)];
		if (adventure.lives > 0) {
			const furiousness = 2 - user.hp / user.getMaxHP();
			let pendingDamage = (user.getPower() + damage) * furiousness;
			if (user.element === element) {
				changeStagger(targets, "elementMatchFoe");
			}
			if (isCrit) {
				pendingDamage *= 2;
			}
			resultLines.push(...dealDamage(targets, user, pendingDamage, false, element, adventure));
			const stillLivingTargets = targets.filter(target => target.hp > 0);
			if (stillLivingTargets.length < targets.length) {
				resultLines.push(...generateModifierResultLines(addModifier([user], powerUp)));
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Bashing Power from Wrath", "Staggering Power from Wrath")
	.setDurability(15)
	.setHPCost(40)
	.setDamage(40)
	.setModifiers({ name: "Power Up", stacks: 15 });
