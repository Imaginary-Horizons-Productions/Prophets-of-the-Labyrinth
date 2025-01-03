const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, dealDamage, gainHealth, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	[
		["use", "Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}, then gain @{healing} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [exposed], damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		resultLines.push(gainHealth(user, pendingHealing, adventure));
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			resultLines.push(...generateModifierResultLines(addModifier(stillLivingTargets, exposed)));
		}

		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Furios Life Drain", "Thirsting Life Drain")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setCharges(15)
	.setDamage(40)
	.setHealing(25);
