const { GearTemplate } = require('../classes');
const { addModifier, changeStagger, addProtection, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Buckler",
	[
		["use", "Grant an ally @{protection} protection and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Earth",
	200,
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
		const resultLines = [joinAsStatement(false, getNames(targets, adventure), "gains", "gain", "protection.")];
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		if (addedPowerUp) {
			resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Power Up")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Devoted Buckler", "Guarding Buckler", "Reinforced Buckler")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setProtection(75);
