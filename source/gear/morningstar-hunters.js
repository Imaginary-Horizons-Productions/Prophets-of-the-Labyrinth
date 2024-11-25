const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { dealDamage, changeStagger, addModifier, generateModifierResultLines } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Hunter's Morning Star",
	[
		["use", "Strike a foe for @{damage} @{element} damage; gain @{mod0Stacks} @{mod0} on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Light",
	350,
	(targets, user, adventure) => {
		const { element, stagger, damage, critMultiplier, modifiers: [powerUp] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingStagger = stagger;
		if (user.element === element) {
			pendingStagger += ELEMENT_MATCH_STAGGER_FOE;
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		changeStagger(targets, user, pendingStagger);
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length < targets.length) {
			resultLines.push(...generateModifierResultLines(addModifier([user], powerUp)));
		}
		resultLines.push(joinAsStatement(false, stillLivingTargets.map(target => target.name), "was", "were", "Staggered."))
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Awesome Morning Star", "Bashing Morning Star")
	.setStagger(2)
	.setDurability(15)
	.setDamage(40)
	.setModifiers({ name: "Power Up", stacks: 15 });
