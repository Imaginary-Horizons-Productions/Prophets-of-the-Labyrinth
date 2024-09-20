const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger, addModifier, getNames } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Soothing Second Wind",
	[
		["use", "Regain @{damage} HP and gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier, modifiers: [regen] } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = [gainHealth(user, pendingHealing, adventure)];
		const addedRegen = addModifier([user], regen).length > 0;
		if (addedRegen) {
			resultLines.push(`${getNames([user], adventure)} gains ${getApplicationEmojiMarkdown("Regen")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Cleansing Second Wind", "Lucky Second Wind")
	.setDurability(10)
	.setDamage(0)
	.setModifiers({ name: "Regen", stacks: 2 });
