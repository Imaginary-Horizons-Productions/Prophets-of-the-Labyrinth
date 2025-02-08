const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Hastening Parrying Dagger",
	[
		["use", "Gain <@{protection}> protection and @{mod0Stacks} @{mod0}"],
		["critical", "@{mod0} x @{critBonus}, reduce your cooldowns by @{cooldownReduction}"]
	],
	"Defense",
	"Light",
	350,
).setEffect(
	(targets, user, adventure) => {
		const { essence, modifiers: [finesse], scalings: { critBonus, protection, cooldownReduction } } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingFinesse = { ...finesse };
		let didCooldown = false;
		if (user.crit) {
			pendingFinesse.stacks *= critBonus;
			user.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= cooldownReduction;
				}
			})
		}
		addProtection([user], protection.calculate(user));
		if (didCooldown) {
			return [`${user.name} gains protection and hastens their cooldowns.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
		} else {
			return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
		}
	}, { type: "self", team: "ally" })
	.setSidegrades("Devoted Parrying Dagger")
	.setCooldown(1)
	.setScalings({
		protection: protectionScalingGenerator(75),
		critBonus: 2,
		cooldownReduction: 1
	})
	.setModifiers({ name: "Finesse", stacks: 1 });
