const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { dealDamage, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

const actionName = "Tormenting Deck of Cards";
module.exports = new GearTemplate(actionName,
	[
		["use", "Deal @{damage} @{essence} damage, increase debuff stacks by 1, and inflict between @{bonus} and @{secondBonus} stacks of @{mod0} randomly on a single foe"],
		["Critical💥", "Damage x @{critMultiplier}"]
	],
	"Action",
	"Wind",
	0,
	(targets, user, adventure) => {
		const { essence, critMultiplier, modifiers: [misfortune] } = module.exports;
		let pendingDamage = user.getPower();
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		const reciepts = [];
		for (const target of targets) {
			for (const modifier in target.modifiers) {
				if (getModifierCategory(modifier) === "Debuff") {
					reciepts.push(...addModifier([target], { name: modifier, stacks: 1 }));
				}
			}
		}
		reciepts.push(...addModifier(stillLivingTargets, { name: misfortune.name, stacks: 2 + user.roundRns[`${actionName}${SAFE_DELIMITER}Deck of Cards`][0] }));
		return resultLines.concat(generateModifierResultLines(reciepts));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setDamage(0)
	.setModifiers({ name: "Misfortune", stacks: 0 })
	.setBonus(2) // Min stacks
	.setSecondBonus(9) // Max stacks
	.setRnConfig({
		["Deck of Cards"]: 1
	});
