const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { scalingTorpidity } = require('./shared/modifiers');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Tormenting Net Launcher",
	[
		["use", "Inflict <@{damage}> @{essence} damage and <@{mod0Stacks}> @{mod0} on a foe and add @{debuffIncrement} stack to each of their debuffs"],
		["Critical💥", "Damage x @{critBonus}; inflict @{mod0} on all foes instead"]
	],
	"Offense",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus }, modifiers: [torpidity] } = module.exports;
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
		const reciepts = addModifier(torpidityTargets, { name: torpidity.name, stacks: torpidity.stacks.calculate(user) });
		for (const target of targets) {
			if (target.hp > 0) {
				for (const modifier in target.modifiers) {
					if (getModifierCategory(modifier) === "Debuff") {
						reciepts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
					}
				}
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}, { type: "single", team: "foe" })
	.setSidegrades("Thief's Net Launcher")
	.setCooldown(1)
	.setScalings({ damage: damageScalingGenerator(40), critBonus: 2, debuffIncrement: 1 })
	.setModifiers(scalingTorpidity(3));
