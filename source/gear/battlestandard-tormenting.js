const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');
const { damageScalingGenerator } = require('./shared/scalings');

module.exports = new GearTemplate("Tormenting Battle Standard",
	[
		["use", "Deal <@{damage}> @{essence} damage to a single foe and add @{debuffIncrement} stack to each of their debuffs"],
		["Critical💥", "Damage x @{critBonus}, increase the party's morale by @{morale}"]
	],
	"Offense",
	"Light"
).setCost(350)
	.setEffect((targets, user, adventure) => {
		const { essence, scalings: { damage, critBonus, debuffIncrement, morale } } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage.calculate(user);
		if (user.crit) {
			pendingDamage *= critBonus;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const reciepts = [];
		for (const target of targets) {
			for (const modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Debuff") {
					reciepts.push(...addModifier([target], { name: modifier, stacks: debuffIncrement }));
				}
			}
		}
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(reciepts)));
		if (user.crit) {
			adventure.room.morale += morale;
			resultLines.push("The party's morale is increased!")
		}
		return resultLines;
	}, { type: "single", team: "foe" })
	.setSidegrades("Thief's Battle Standard")
	.setCooldown(1)
	.setScalings({
		damage: damageScalingGenerator(40),
		critBonus: 2,
		morale: 1,
		debuffIncrement: 1
	});
