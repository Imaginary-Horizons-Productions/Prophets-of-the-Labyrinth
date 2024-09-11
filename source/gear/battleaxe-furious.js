const { GearTemplate } = require('../classes/index.js');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Furious Battleaxe",
	[
		["use", "Strike a foe for @{damage} @{element} damage (increases with your missing hp), gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier } = module.exports;
		const furiousness = ((user.getMaxHP() - user.hp) / user.getMaxHP() + 1) / 2;
		let pendingDamage = (user.getPower() + damage) * furiousness;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const addedExposed = addModifier([user], exposed).length > 0;
		return `${dealDamage(targets, user, pendingDamage, false, element, adventure)}${addedExposed ? ` ${getNames([user], adventure)[0]} is Exposed.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reactive Battleaxe", "Thirsting Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90);
