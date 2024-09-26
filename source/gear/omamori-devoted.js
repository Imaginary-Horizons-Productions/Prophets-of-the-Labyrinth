const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { listifyEN, joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Devoted Omamori",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger(targets, "elementMatchAlly");
		}
		if (isCrit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection(targets, protection);
		const gainedEffects = ["protection"];
		const addedLucky = addModifier(targets, pendingLucky).length > 0;
		if (addedLucky) {
			gainedEffects.push(getApplicationEmojiMarkdown("Lucky"));
		}
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", `${listifyEN(gainedEffects)}.`)];
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Centering Omamori", "Cleansing Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setDurability(10);
