const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Distracting Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage and @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier, modifiers: [distracted] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const distractedTargets = addModifier(targets, distracted);
		resultSentences.push(joinAsStatement(false, getNames(distractedTargets, adventure), "is", "are", "Distracted."));
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Vexing Prismatic Blast")
	.setModifiers({ name: "Distracted", stacks: 2 })
	.setDurability(15)
	.setDamage(40);
