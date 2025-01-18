const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, dealDamage, generateModifierResultLines, removeModifier } = require('../util/combatantUtil');
const { archetypeActionDamageScaling } = require('./shared/scalings');

const actionName = "Disenchanting Battle Standard";
module.exports = new GearTemplate(actionName,
	[
		["use", "Deal <@{damage}> @{essence} damage to and remove a random buff from a foe"],
		["Critical💥", "Damage x @{critBonus}, increase party morale by @{morale}"]
	],
	"Action",
	"Light"
).setEffect(([target], user, adventure) => {
	const { essence, scalings: { damage, critBonus, morale } } = module.exports;
	let pendingDamage = damage.calculate(user);
	const resultLines = [];
	if (user.crit) {
		pendingDamage *= critBonus;
		adventure.room.morale += morale;
		resultLines.push("The party's morale is increased!")
	}
	resultLines.unshift(...dealDamage([target], user, pendingDamage, false, essence, adventure));
	if (target.hp > 0) {
		changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		const targetBuffs = Object.keys(target.modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		resultLines.push(...generateModifierResultLines(removeModifier([target], { name: targetBuffs[user.roundRns[`${actionName}${SAFE_DELIMITER}buffs`][0] % targetBuffs.length], stacks: "all" })));
	}
	return resultLines;
}, { type: "single", team: "foe" })
	.setScalings({
		damage: archetypeActionDamageScaling,
		critBonus: 2,
		morale: 1
	})
	.setRnConfig({
		buffs: 1
	});
