const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, selectSelf } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil.js");

module.exports = new EnemyTemplate("Fire-Arrow Frog",
	"Fire",
	250,
	100,
	"4",
	0,
	"random",
	false
).addAction({
	name: "Venom Cannon",
	element: "Fire",
	description: `Inflict minor ${getEmoji("Fire")} damage and @e{Poison} on a single foe`,
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let damage = user.getPower() + 20;
		return dealDamage(targets, user, damage, false, user.element, adventure).concat(addModifier(targets, { name: "Poison", stacks: isCrit ? 6 : 3 }));
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "random"
}).addAction({
	name: "Burrow",
	element: "Untyped",
	description: "Gain Evade",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let stacks = 2;
		if (isCrit) {
			stacks *= 3;
		}
		changeStagger([user], "elementMatchAlly");
		return addModifier([user], { name: "Evade", stacks }).length > 0;
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: "Venom Cannon"
}).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Slow a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		if (isCrit) {
			changeStagger(targets, "elementMatchFoe");
		}
		return addModifier(targets, { name: "Slow", stacks: isCrit ? 3 : 2 });
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Venom Cannon"
});
