const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Furious Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{healing}> HP"],
		["Critical💥", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, healing, critBonus } } = module.exports;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const resultLines = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	const stillLivingTargets = targets.filter(target => target.hp > 0);
	changeStagger(stillLivingTargets, user, ESSENCE_MATCH_STAGGER_FOE);
	return resultLines.concat(gainHealth(user, pendingHealing, adventure));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: {
			description: "Power x 1 to 1.5 based on your missing HP",
			calculate: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return user.getPower() * furiousness;
			}
		},
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	});
