const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Battleaxe",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedExposed = addModifier([user], exposed).length > 0;
		if (addedExposed) {
			resultLines.push(`${getNames([user], adventure)[0]} gains ${getApplicationEmojiMarkdown("Exposed")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Furious Battleaxe", "Reactive Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
