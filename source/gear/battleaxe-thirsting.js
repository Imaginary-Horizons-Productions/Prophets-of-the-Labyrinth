const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, gainHealth, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Battleaxe",
	"Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; heal @{healing} hp on kill",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier, healing } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedExposed = addModifier([user], exposed).length > 0;
		let resultText = dealDamage(targets, user, pendingDamage, false, element, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		resultText += gainHealth(user, healing * killCount, adventure);
		return `${resultText}${addedExposed ? ` ${getNames([user], adventure)[0]} is Exposed.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Prideful Battleaxe", "Thick Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90)
	.setHealing(60);
