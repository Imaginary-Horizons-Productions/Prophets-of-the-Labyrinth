const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
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
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const distractedTargets = addModifier(targets, distracted);
		if (distractedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, distractedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Distracted")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Flanking Prismatic Blast", "Vexing Prismatic Blast")
	.setModifiers({ name: "Distracted", stacks: 2 })
	.setDurability(15)
	.setDamage(40);
