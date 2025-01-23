const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator, archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Juggernaut's Lance",
	[
		["use", "Gain <@{protection}> protection twice, then deal <@{damage}> @{essence} damage to a foe"],
		["Critical💥", "Protection x @{critBonus}"]
	],
	"Action",
	"Water"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, protection, critBonus } } = module.exports;
	let pendingProtection = protection.calculate(user);
	if (user.crit) {
		pendingProtection *= critBonus;
	}
	addProtection([user], pendingProtection);
	addProtection([user], pendingProtection);
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(`${user.name} gains protection.`);
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		protection: protectionScalingGenerator(12)
	});
