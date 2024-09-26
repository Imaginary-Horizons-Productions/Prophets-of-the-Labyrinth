const { GearTemplate } = require('../classes/index.js');
const { addModifier, dealDamage, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Furious Battleaxe",
	[
		["use", "Strike a foe for @{damage} @{element} damage (increases with your missing HP), gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		let pendingDamage = (user.getPower() + damage) * furiousness;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		const addedExposed = addModifier([user], exposed).length > 0;
		if (addedExposed) {
			resultLines.push(`${user.name} gains ${getApplicationEmojiMarkdown("Exposed")}.`);
		}
		return resultLines;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
