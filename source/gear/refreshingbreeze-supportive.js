const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Supportive Refreshing Breeze",
	[
		["use", "Cure a random debuff from each ally"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, stagger } = module.exports;
		const resultTexts = ["All allies shrug off some Stagger."];
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		changeStagger(targets, stagger);
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
		return resultTexts.join(" ");
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Swift Refreshing Breeze")
	.setDurability(15)
	.setStagger(-2);
