const { GearTemplate } = require('../classes');
const { payHP, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Hunter's Power from Wrath",
	[
		["use", "Pay @{hpCost} to strike a foe for @{damage} @{element} damage (greatly increases with your missing hp)"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Pact",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, hpCost, modifiers: [powerUp] } = module.exports;
		const resultSentences = [payHP(user, hpCost, adventure)];
		const furiousness = 2 - user.hp / user.getMaxHP();
		let pendingDamage = (user.getPower() + damage) * furiousness;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= 2;
		}
		resultSentences.push(dealDamage(targets, user, pendingDamage, false, element, adventure));
		const originalTargetCount = targets.length;
		targets = targets.filter(target => target.hp > 0);
		if (targets.length < originalTargetCount) {
			const addedPowerUp = addModifier([user], powerUp).length > 0;
			if (addedPowerUp) {
				resultSentences.push(`${getNames([user], adventure)[0]} was Powered Up.`);
			}
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Bashing Power from Wrath", "Staggering Power from Wrath")
	.setDurability(15)
	.setHPCost(40)
	.setDamage(40)
	.setModifiers({ name: "Power Up", stacks: 15 });
