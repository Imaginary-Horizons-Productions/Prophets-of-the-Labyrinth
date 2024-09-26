const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Lucky Second Wind",
	[
		["use", "Regain @{damage} HP and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier, modifiers: [lucky] } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = [gainHealth(user, pendingHealing, adventure)];
		const addedLucky = addModifier([user], lucky).length > 0;
		if (addedLucky) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Lucky")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Cleansing Second Wind", "Soothing Second Wind")
	.setModifiers({ name: "Lucky", stacks: 1 })
	.setDurability(10)
	.setDamage(0);
