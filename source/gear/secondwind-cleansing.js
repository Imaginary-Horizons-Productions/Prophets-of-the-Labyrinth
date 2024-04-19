const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { gainHealth, removeModifier, changeStagger, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Cleansing Second Wind",
	"Regain @{healing} hp and shrug off a random debuff.",
	"Healing x@{critMultiplier}",
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { healing, element, critMultiplier } = module.exports;
		let pendingHealing = healing;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		let resultText = gainHealth(user, pendingHealing, adventure);
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (userDebuffs.length > 0) {
			const rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			const debuffWasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
			if (debuffWasRemoved) {
				resultText += ` ${getNames([user], adventure)[0]} shrugs off ${rolledDebuff}.`;
			}
		}
		return resultText;
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Soothing Second Wind")
	.setDurability(15)
	.setHealing(45);
