const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, dealDamage, gainHealth, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Flanking Life Drain",
	[
		["use", "Strike a foe for @{damage} @{essence} damage and inflict @{mod0Stacks} @{mod0}, then gain @{healing} HP"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [exposed], damage, healing, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHealing = healing;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
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
