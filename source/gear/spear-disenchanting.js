const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, removeModifier } = require('../util/combatantUtil');

const actionName = "Disenchanting Spear";
module.exports = new GearTemplate(actionName,
	[
		["use", "Deal @{damage} @{essence} damage to and remove a random buff from a single foe"],
		["Critical💥", "Damage x @{critMultiplier}, increase party morale by @{bonus}"]
	],
	"Action",
	"Light",
	0,
	([target], user, adventure) => {
		const { essence, critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower();
		const resultLines = [];
		if (user.crit) {
			pendingDamage *= critMultiplier;
			adventure.room.morale += bonus;
			resultLines.push("The party's morale is increased!")
		}
		resultLines.unshift(...dealDamage([target], user, pendingDamage, false, essence, adventure));
		if (target.hp > 0) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
			const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
			resultLines.push(...generateModifierResultLines(removeModifier([target], { name: targetBuffs[user.roundRns[`${actionName}${SAFE_DELIMITER}buffs`][0] % targetBuffs.length], stacks: "all" })));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setBonus(1) // Morale
	.setRnConfig({
		buffs: 1
	});
