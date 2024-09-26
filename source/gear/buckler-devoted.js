const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Devoted Buckler",
	[
		["use", "Grant an ally @{protection} protection and @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection(targets, pendingProtection);
		const poweredUpTargets = addModifier(targets, powerUp);
		const resultLines = [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection.")];
		if (poweredUpTargets.length > 0) {
			resultLines.push(`${joinAsStatement(false, poweredUpTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Power Up")}.`)}`)
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
