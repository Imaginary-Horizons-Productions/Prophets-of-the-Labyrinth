const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Thief's Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to a single foe, gain @{bounty}g if they're downed"],
		["Critical💥", "Damage x @{critBonus}, increase the party's morale by @{morale}"]
	],
	"Offense",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, morale, bounty } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		const resultLines = [];
		if (user.crit) {
			pendingDamage *= critBonus;
			adventure.room.morale += morale;
			resultLines.push("The party's morale is increased!")
		}
		resultLines.unshift(...dealDamage(targets, user, pendingDamage, false, essence, adventure));
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		if (killCount > 0) {
			const totalBounty = killCount * bounty;
			adventure.room.addResource("Gold", "Currency", "loot", totalBounty);
			resultLines.push(`${user.name} pillages ${totalBounty}g.`);
		}

		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Tormenting Battle Standard")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		morale: 1,
		bounty: 30
	});
