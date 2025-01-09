const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, downedCheck } = require('../util/combatantUtil');

module.exports = new GearTemplate("Thief's Flame Scythes",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe, execute them and add @{bonus}g to loot if they end below half your damage cap"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Spell",
	"Fire",
	350,
	([target], user, adventure) => {
		const { essence, damage, critMultiplier, bonus } = module.exports;
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage([target], user, pendingDamage, false, essence, adventure);
		if (target.hp > (user.getDamageCap() / 2)) {
			target.hp = 0;
			const { extraLines } = downedCheck(target, adventure);
			adventure.room.addResource("Gold", "Currency", "loot", bonus);
			extraLines.push(`${user.name} pillages ${bonus}g.`);
			return [`${target.name} meets the reaper!`].concat(extraLines);
		} else {
			return resultLines;
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Toxic Flame Scythes")
	.setCharges(15)
	.setDamage(40)
	.setBonus(30); // Bounty
