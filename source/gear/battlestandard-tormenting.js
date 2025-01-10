const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Tormenting Battle Standard",
	[
		["use", "Deal @{damage} @{essence} damage to a single foe and add @{secondBonus} stack to each of their debuffs"],
		["Critical💥", "Damage x @{critMultiplier}, increase the party's morale by @{bonus}"]
	],
	"Offense",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, damage, bonus, secondBonus } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingDamage = damage + user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const reciepts = [];
		for (const target of targets) {
			for (const modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Debuff") {
					reciepts.push(...addModifier([target], { name: modifier, stacks: secondBonus }));
				}
			}
		}
		resultLines.push(...generateModifierResultLines(combineModifierReceipts(reciepts)));
		if (user.crit) {
			adventure.room.morale += bonus;
			resultLines.push("The party's morale is increased!")
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Thief's Battle Standard")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(1) // Morale
	.setSecondBonus(1); // Debuff increment
