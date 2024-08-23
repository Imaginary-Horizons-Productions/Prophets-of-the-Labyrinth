const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Certain Victory",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} (+@{mod1Stacks} on kill); pay HP for your @{mod0}",
	"Damage x@{critMultiplier}",
	"Pact",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp, huntersPowerUp], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		const pendingPowerUp = { ...powerUp };
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultSentences = [dealDamage([target], user, pendingDamage, false, element, adventure)];
		if (target.hp < 1) {
			pendingPowerUp.stacks += huntersPowerUp.stacks;
		}
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		if (addedPowerUp) {
			resultSentences.push(`${getNames([user], adventure)[0]} is Powered Up.`);
		}
		resultSentences.push(payHP(user, user.getModifierStacks("Power Up"), adventure));
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(40);
