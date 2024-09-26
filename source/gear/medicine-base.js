const { GearTemplate } = require('../classes');
const { addModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Medicine",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => {
		const { modifiers: [regen], critMultiplier, element } = module.exports;
		const pendingRegen = { ...regen };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingRegen.stacks *= critMultiplier;
		}
		const regenedTargets = addModifier(targets, pendingRegen);
		if (regenedTargets.length > 0) {
			return [joinAsStatement(false, regenedTargets.map(target => target.name), "gains", "gain", `${getApplicationEmojiMarkdown("Regen")}.`)];
		} else {
			return [];
		}
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setUpgrades("Bouncing Medicine", "Cleansing Medicine", "Soothing Medicine")
	.setModifiers({ name: "Regen", stacks: 3 })
	.setDurability(15);
