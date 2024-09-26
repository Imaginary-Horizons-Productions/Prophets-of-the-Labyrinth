const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Lucky Scutum",
	[
		["use", "Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Protection x@{critMultiplier}"]
	],
	"Armor",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target, user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target, user], pendingProtection);
		const resultLines = [`${target.name} and ${user.name} gain protection.`];
		const addedLucky = addModifier([user], lucky).length > 0;
		if (addedLucky) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Lucky")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Sweeping Scutum")
	.setModifiers({ name: "Lucky", stacks: 1 })
	.setDurability(15)
	.setProtection(75);
