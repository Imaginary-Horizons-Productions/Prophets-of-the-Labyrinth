const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { swiftPassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Swift Refreshing Breeze",
	[
		swiftPassive,
		["use", "Cure a random debuff from each ally"],
		["Critical💥", "Debuffs cured x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element } = module.exports;
		const resultLines = [];
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		for (const target of targets) {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => isDebuff(modifier));
			if (targetDebuffs.length > 0) {
				const debuffsToRemove = Math.min(targetDebuffs.length, isCrit ? 2 : 1);
				const removedDebuffs = [];
				for (let i = 0; i < debuffsToRemove; i++) {
					const debuffIndex = adventure.generateRandomNumber(targetDebuffs.length, "battle");
					const rolledDebuff = targetDebuffs[debuffIndex];
					const wasRemoved = target.getModifierStacks("Retain") < 1;
					removeModifier([target], { name: rolledDebuff, stacks: "all" });
					if (wasRemoved) {
						removedDebuffs.push(getApplicationEmojiMarkdown(rolledDebuff));
						targetDebuffs.splice(debuffIndex, 1);
					}
				}
				if (removedDebuffs.length > 0) {
					resultLines.push(`${target.name} is cured of ${removedDebuffs.join("")}.`)
				}
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Accelerating Refreshing Breeze", "Supportive Refreshing Breeze")
	.setDurability(15)
	.setSpeed(2);
