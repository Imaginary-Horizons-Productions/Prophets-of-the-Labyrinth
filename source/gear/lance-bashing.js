const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, addProtection } = require('../util/combatantUtil');
const { protectionScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Bashing Lance",
	[
		["use", "Gain <@{protection}> protection, then deal <@{damage}> @{essence} damage to a foe"],
		["critical", "Protection x @{critBonus}"]
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
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	return resultLines.concat(`${user.name} gains protection.`);
}, { type: "single", team: "foe" })
	.setScalings({
		damage: { description: "Power + protection", calculate: (user) => user.getPower() + user.protection },
		critBonus: 2,
		protection: protectionScalingGenerator(25)
	});
