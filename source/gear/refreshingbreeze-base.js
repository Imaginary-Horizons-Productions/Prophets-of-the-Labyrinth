const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Refreshing Breeze",
	[
		["use", "Cure a random debuff from each ally"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	200,
	(targets, user, isCrit, adventure) => {
		const { element } = module.exports;
		const resultTexts = [];
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		targets.forEach(target => {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => isDebuff(modifier));
			if (targetDebuffs.length > 0) {
				const debuffsToRemove = Math.min(targetDebuffs.length, isCrit ? 2 : 1);
				const removedDebuffs = [];
				for (let i = 0; i < debuffsToRemove; i++) {
					const debuffIndex = adventure.generateRandomNumber(targetDebuffs.length, "battle");
					const rolledDebuff = targetDebuffs[debuffIndex];
					const wasRemoved = removeModifier([target], { name: rolledDebuff, stacks: "all" }).length > 0;
					if (wasRemoved) {
						removedDebuffs.push(rolledDebuff);
						targetDebuffs.splice(debuffIndex, 1);
					}
				}
				if (removedDebuffs.length > 0) {
					resultTexts.push(`${getNames([target], adventure)[0]} is cured of ${listifyEN(removedDebuffs)}.`)
				}
			}
		})
		if (resultTexts.length > 0) {
			return resultTexts.join(" ");
		} else {
			return "No debuffs were cured on the party.";
		}
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setUpgrades("Accelerating Refereshing Breeze", "Supportive Refreshing Breeze", "Swift Refreshing Breeze")
	.setDurability(15);
