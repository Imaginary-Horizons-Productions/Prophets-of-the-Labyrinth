const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Refreshing Breeze",
	"Cure a random debuff from each ally",
	"Debuffs cured x@{critBonus}",
	"Spell",
	"Wind",
	200,
	(targets, user, isCrit, adventure) => {
		let { element } = module.exports;
		const resultTexts = [];
		targets.forEach(target => {
			if (user.element === element) {
				target.addStagger("elementMatchAlly");
			}
			const targetDebuffs = Object.keys(target.modifiers).filter(modifier => isDebuff(modifier));
			const removedDebuffs = [];
			if (isCrit && targetDebuffs.length > 1) {
				for (let i = 0; i < 2; i++) {
					const debuffIndex = adventure.generateRandomNumber(targetDebuffs.length, "battle");
					const rolledDebuff = targetDebuffs[debuffIndex];
					const wasRemoved = removeModifier(target, { name: rolledDebuff, stacks: "all" });
					if (wasRemoved) {
						removedDebuffs.push(rolledDebuff);
						targetDebuffs.splice(debuffIndex, 1);
					}
				}
			} else if (targetDebuffs.length > 0) {
				const rolledDebuff = targetDebuffs[adventure.generateRandomNumber(targetDebuffs.length, "battle")];
				const wasRemoved = removeModifier(target, { name: rolledDebuff, stacks: "all" });
				if (wasRemoved) {
					removedDebuffs.push(rolledDebuff);
				}
			}
			if (removedDebuffs.length > 1) {
				resultTexts.push(`${target.getName(adventure.room.enemyIdMap)} is cured of ${removedDebuffs[0]} and ${removedDebuffs[1]}.`)
			} else if (removedDebuffs.length > 0) {
				resultTexts.push(`${target.getName(adventure.room.enemyIdMap)} is cured of ${removedDebuffs[0]}.`)
			}
		})
		if (resultTexts.length > 0) {
			return resultTexts.join(" ");
		} else {
			return "No debuffs were cured on the party.";
		}
	}
).setTargetingTags({ target: "all", team: "ally", needsLivingTargets: true })
	.setDurability(15);
