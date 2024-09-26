const { GearTemplate } = require("../classes");
const { addModifier, dealDamage, changeStagger } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { joinAsStatement } = require("../util/textUtil");

module.exports = new GearTemplate("Harmful Corrosion",
	[
		["use", "Inflict @{damage} @{element} damage and @{mod0Stacks} @{mod0} on a foe"],
		["Critical💥", "Inflict @{bonus} more Stagger"]
	],
	"Spell",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerDown], bonus, damage } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		if (isCrit) {
			changeStagger(targets, bonus);
			resultLines.push(joinAsStatement(false, targets.map(target => target.name), "was", "were", "Staggered."));
		}
		const poweredDownTargets = addModifier(targets, powerDown);
		if (poweredDownTargets.length > 0) {
			resultLines.push(joinAsStatement(false, poweredDownTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Power Down")}.`));
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Fate-Sealing Corrosion", "Shattering Corrosion")
	.setModifiers({ name: "Power Down", stacks: 20 })
	.setBonus(2) // Crit Stagger
	.setDamage(50)
	.setDurability(15);
