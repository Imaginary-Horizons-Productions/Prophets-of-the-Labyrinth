const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { gainHealth, dealDamage, changeStagger } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

module.exports = new GearTemplate("Reaper's Life Drain",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe and regain <@{healing}> HP, execute them if they end below half your damage cap"],
		["Critical💥", "Healing x @{critBonus}"]
	],
	"Action",
	"Darkness"
).setEffect(([target], user, adventure) => {
	const { essence, scalings: { damage, healing, critBonus } } = module.exports;
	let pendingHealing = healing.calculate(user);
	if (user.crit) {
		pendingHealing *= critBonus;
	}
	const { resultLines } = dealDamage([target], user, damage.calculate(user), false, essence, adventure);
	if (target.hp > (user.getDamageCap() / 2)) {
		target.hp = 0;
		const { extraLines } = downedCheck(target, adventure);
		return [`${target.name} meets the reaper!`].concat(extraLines, gainHealth(user, pendingHealing, adventure));
	} else {
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		return resultLines.concat(gainHealth(user, pendingHealing, adventure));
	}
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		healing: { description: "5% Max HP", calculate: (user) => Math.floor(user.getMaxHP() / 20) }
	});
