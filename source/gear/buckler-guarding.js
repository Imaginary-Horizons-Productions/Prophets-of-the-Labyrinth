const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil');
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
		const [userName, ...targetNames] = getNames([user, ...targets], adventure);
		const resultLines = [joinAsStatement(false, targetNames, "gains", "gain", "protection.")];
		if (addedPowerUp) {
			resultLines.push(`${userName} gains ${getApplicationEmojiMarkdown("Power Up")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Devoted Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(125);
