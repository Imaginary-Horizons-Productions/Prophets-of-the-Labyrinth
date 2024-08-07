const { GearTemplate } = require('../classes/index.js');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Lethal Shortsword",
	"Strike a foe for @{damage} @{element} damage, then apply @{mod0Stacks} @{mod0} to both the foe and yourself",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		let resultText = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedExposedUser = addModifier([user], exposed).length > 0;
		if (addedExposedUser) {
			resultText += ` ${getNames([user], adventure)} is Exposed.`;
		}
		const exposedTargets = addModifier(targets.filter(target => target.hp > 0), exposed);
		if (exposedTargets.length > 0) {
			resultText += ` ${joinAsStatement(false, getNames(exposedTargets, adventure), "is", "are", "Exposed.")}`;
		}
		return resultText;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Shortsword", "Toxic Shortsword")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(40)
	.setCritMultiplier(3);
