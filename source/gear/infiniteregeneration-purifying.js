const { GearTemplate } = require('../classes/index.js');
const { isDebuff } = require('../modifiers/_modifierDictionary.js');
const { addModifier, payHP, changeStagger, getNames, removeModifier } = require('../util/combatantUtil.js');
const { joinAsStatement, listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Purifying Infinite Regeneration",
	"Pay @{hpCost} hp to grant an ally @{mod0Stacks} @{mod0} and cure all their debuffs",
	"HP Cost / @{critMultiplier}",
	"Pact",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [regen], hpCost, critMultiplier } = module.exports;
		let pendingHPCost = hpCost;
		if (isCrit) {
			pendingHPCost /= critMultiplier;
		}
		const paymentSentence = payHP(user, pendingHPCost, adventure);
		if (adventure.lives < 1) {
			return paymentSentence;
		}
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		const resultSentences = [paymentSentence];
		const regenedTargets = addModifier(targets, regen);
		if (regenedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen."));
		}
		const targetNames = getNames(targets, adventure);
		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const curedDebuffs = [];
			Object.keys(target.modifiers).forEach(modifier => {
				if (isDebuff(modifier)) {
					const didRemoveDebuff = removeModifier([target], { name: modifier, stacks: "all" }).length > 0;
					if (didRemoveDebuff) {
						curedDebuffs.push(modifier);
					}
				}
			})
			resultSentences.push(`${targetNames[i]} is cured of ${listifyEN(curedDebuffs)}.`);
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Discounted Infinite Regeneration", "Fate-Sealing Infinite Regeneration")
	.setModifiers({ name: "Regen", stacks: 4 })
	.setHPCost(50)
	.setDurability(10);