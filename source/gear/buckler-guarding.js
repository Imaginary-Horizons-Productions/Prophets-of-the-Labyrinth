const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Guarding Buckler",
	[
		["use", "Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}"],
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
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		const resultLines = [joinAsStatement(false, [user, ...targets].map(combatant => combatant.name), "gains", "gain", "protection.")];
		if (addedPowerUp) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Power Up")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(125);
