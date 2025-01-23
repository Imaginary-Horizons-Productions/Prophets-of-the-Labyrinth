const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, downedCheck } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Thief's Flame Scythes",
	[
		["use", "Deal <@{damage}> @{essence} damage to a foe, execute them and add @{bounty}g to loot if they end below half your damage cap"],
		["Critical💥", "Damage x @{critBonus}"]
	],
	"Spell",
	"Fire"
).setCost(350)
	.setEffect(([target], user, adventure) => {
		const { essence, scalings: { damage, critBonus, bounty } } = module.exports;
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const { resultLines } = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (target.hp > (user.getDamageCap() / 2)) {
			target.hp = 0;
			const { extraLines } = downedCheck(target, adventure);
			adventure.room.addResource("Gold", "Currency", "loot", bounty);
			extraLines.push(`${user.name} pillages ${bounty}g.`);
			return [`${target.name} meets the reaper!`].concat(extraLines);
		} else {
			if (user.essence === essence) {
				changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
			}
			return resultLines;
		}
	}, { type: "single", team: "foe" })
	.setSidegrades("Toxic Flame Scythes")
	.setCharges(15)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		bounty: 30
	});
