const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

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
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		const resultLines = [];
		targets.forEach(target => {
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => isDebuff(modifier));
			if (targetDebuffs.length > 0) {
				const debuffsToRemove = Math.min(targetDebuffs.length, isCrit ? 2 : 1);
				const removedDebuffs = [];
				for (let i = 0; i < debuffsToRemove; i++) {
					const debuffIndex = user.roundRns[`Refreshing Breeze${SAFE_DELIMITER}debuffs`][0] % targetDebuffs.length;
					const rolledDebuff = targetDebuffs[debuffIndex];
					const wasRemoved = removeModifier([target], { name: rolledDebuff, stacks: "all" }).length > 0;
					if (wasRemoved) {
						removedDebuffs.push(getApplicationEmojiMarkdown(rolledDebuff));
						targetDebuffs.splice(debuffIndex, 1);
					}
				}
				if (removedDebuffs.length > 0) {
					resultLines.push(`${getNames([target], adventure)[0]} is cured of ${removedDebuffs.join("")}.`)
				}
			}
		})
		return resultLines;
	}
).setTargetingTags({ type: "all", team: "ally", needsLivingTargets: true })
	.setUpgrades("Accelerating Refereshing Breeze", "Supportive Refreshing Breeze", "Swift Refreshing Breeze")
	.setDurability(15)
	.setRnConfig({ debuffs: 1 });
