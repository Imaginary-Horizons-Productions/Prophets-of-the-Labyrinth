const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Thirsting Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{baseHealing} (+ @{thirstingHealing})> HP"],
		["critical", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect((targets, user, adventure) => {
	const { essence, scalings: { damage, baseHealing, critBonus, thirstingHealing } } = module.exports;
	let pendingHealing = baseHealing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines, survivors } = dealDamage(targets, user, damage.calculate(user), false, essence, adventure);
	if (user.essence === essence) {
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
	}
	if (survivors.length < targets.length) {
		pendingHealing += thirstingHealing.calculate(user);
	}
	return resultLines.concat(gainHealth(user, pendingHealing, adventure));
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		baseHealing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) },
		thirstingHealing: { description: "10% Max HP if foe is downed", calculate: (user) => Math.floor(user.getMaxHP() / 10) }
	});
