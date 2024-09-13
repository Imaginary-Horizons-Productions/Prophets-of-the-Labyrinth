const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, getNames, addModifier } = require('../util/combatantUtil');
const { listifyEN, joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Accelerating Refreshing Breeze",
	[
		["use", "Cure a random debuff from each ally and grant them @{mod0Stacks} @{mod0}"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [quicken] } = module.exports;
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
		const quickenedTargets = addModifier(targets, quicken);
		if (quickenedTargets.length > 0) {
			resultTexts.push(joinAsStatement(false, getNames(quickenedTargets, adventure), "gains", "gain", "Quicken."));
		}
		if (resultTexts.length > 0) {
			return resultTexts.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Supportive Refreshing Breeze", "Swift Refreshing Breeze")
	.setModifiers({ name: "Quicken", stacks: 2 })
	.setDurability(15);
