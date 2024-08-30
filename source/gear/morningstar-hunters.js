const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames, addModifier } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Hunter's Morning Star",
	"Strike a foe for @{damage} @{element} damage; gain @{mod0Stacks} @{mod0} on kill",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger, damage, critMultiplier, modifiers: [powerUp] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger(targets, stagger);
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const originalTargetCount = targets.length;
		targets = targets.filter(target => target.hp > 0);
		if (targets.length < originalTargetCount) {
			const addedPowerUp = addModifier([user], powerUp).length > 0;
			if (addedPowerUp) {
				resultSentences.push(`${getNames([user], adventure)[0]} was Powered Up.`);
			}
		}
		resultSentences.push(joinAsStatement(false, getNames(targets, adventure), "was", "were", "Staggered."))
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Awesome Morning Star", "Bashing Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40)
	.setModifiers({ name: "Power Up", stacks: 15 });
