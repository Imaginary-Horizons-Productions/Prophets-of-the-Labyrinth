const { GearTemplate } = require('../classes/index.js');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Furious Battleaxe",
	[
		["use", "Strike a foe for <@{damage} x 1 to 1.5 based on your missing HP> @{element} damage, gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
		let pendingDamage = (user.getPower() + damage) * furiousness;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(addModifier([user], exposed)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Reactive Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
