const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingTorpidity } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Thief's Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe, gain @{bounty}g if they're downed"],
		["Critical💥", "Damage x @{critBonus}; inflict @{mod0} on all foes instead"]
	],
	"Offense",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, bounty }, modifiers: [torpidity] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		let torpidityTargets = targets;
		if (user.crit) {
			pendingDamage *= critBonus;
			if (user.team === "delver") {
				torpidityTargets = adventure.room.enemies;
			} else {
				torpidityTargets = adventure.delvers;
			}
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		torpidityTargets = torpidityTargets.filter(target => target.hp > 0);
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
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(torpidityTargets, { name: torpidity.name, stacks: torpidity.stacks.calculate(user) }))));
	}, { type: "single", team: "foe" })
	.setSidegrades("Tormenting Net Launcher")
	.setCooldown(1)
	.setScalings({ damage: damageScalingGenerator(40), critBonus: 2, bounty: 30 })
	.setModifiers(scalingTorpidity(3));
