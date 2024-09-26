const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

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
						removedDebuffs.push(rolledDebuff);
						targetDebuffs.splice(debuffIndex, 1);
					}
				}
				if (removedDebuffs.length > 0) {
					resultLines.push(`${target.name} is cured of ${removedDebuffs.map(debuff => getApplicationEmojiMarkdown(debuff)).join("")}.`)
				}
			}
		}
		return resultLines.concat(addModifier(targets, quicken));
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setSidegrades("Supportive Refreshing Breeze", "Swift Refreshing Breeze")
	.setModifiers({ name: "Quicken", stacks: 2 })
	.setDurability(15);
