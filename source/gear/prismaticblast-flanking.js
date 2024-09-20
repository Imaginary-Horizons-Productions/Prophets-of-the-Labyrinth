const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { dealDamage, changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Flanking Prismatic Blast",
	[
		["use", "Strike a foe and adjacent foes for @{damage} @{element} damage and @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier, modifiers: [exposed] } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const exposedTargets = addModifier(targets, exposed);
		if (exposedTargets.length > 0) {
			resultLines.push(joinAsStatement(false, getNames(exposedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Exposed")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: `blast${SAFE_DELIMITER}1`, team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Prismatic Blast", "Vexing Prismatic Blast")
	.setModifiers({ name: "Exposed", stacks: 2 })
	.setDurability(15)
	.setDamage(40);
