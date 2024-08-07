const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { addModifier, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Cleansing Medicine",
	"Grant an ally @{mod0Stacks} @{mod0} and cure them of a random debuff",
	"@{mod0} x@{critMultiplier}",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingRegen.stacks *= critMultiplier;
		}
		const regenedTargets = addModifier(targets, pendingRegen);
		const cureSentences = [];
		const targetNames = getNames(targets, adventure);
		for (let i = 0; i < targets.length; i++) {
			const target = targets[i];
			const debuffs = Object.keys(target.modifiers).filter(modifier => isDebuff(modifier));
			if (debuffs.length > 0) {
				const rolledDebuff = debuffs[adventure.generateRandomNumber(debuffs.length, "battle")];
				const debuffWasRemoved = removeModifier([target], { name: rolledDebuff, stacks: "all" }).length > 0;
				if (debuffWasRemoved) {
					cureSentences.push(`${targetNames[i]} is cured of ${rolledDebuff}.`);
				}
			}
		}

		if (regenedTargets.length > 0) {
			if (cureSentences.length > 0) {
				return `${joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen.")} ${cureSentences.join(" ")}`;
			} else {
				return joinAsStatement(false, getNames(regenedTargets, adventure), "gains", "gain", "Regen.");
			}
		} else if (cureSentences.length > 0) {
			return cureSentences.join(" ");
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Bouncing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15);
