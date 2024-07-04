const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, gainHealth, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	"Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}, then gain @{healing} hp",
	"Healing x@{critMultiplier}",
	"Spell",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const resultText = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const exposedTargets = addModifier(targets, exposed);
		return `${resultText}${exposedTargets.length > 0 ? ` ${joinAsStatement(false, getNames(exposedTargets, adventure), "is", "are", "Exposed.")}` : ""} ${gainHealth(user, pendingHealing, adventure)}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Furios Life Drain", "Thirsting Life Drain")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40)
	.setHealing(25);
