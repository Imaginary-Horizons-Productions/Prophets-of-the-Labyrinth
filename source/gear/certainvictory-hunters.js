const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, payHP, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Hunter's Certain Victory",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0} (+@{mod1Stacks} on kill); pay HP for your @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
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
		const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
		if (target.hp < 1) {
			pendingPowerUp.stacks += huntersPowerUp.stacks;
		}
		resultLines.push(...addModifier([user], powerUp).length, payHP(user, user.getModifierStacks("Power Up"), adventure));
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Certain Victory", "Reckless Certain Victory")
	.setModifiers({ name: "Power Up", stacks: 25 }, { name: "Power Up", stacks: 30 })
	.setDurability(15)
	.setDamage(40);
