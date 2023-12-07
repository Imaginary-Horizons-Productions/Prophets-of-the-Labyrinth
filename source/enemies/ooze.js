const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRandom } = require("../shared/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("@{adventureOpposite} Ooze",
	"@{adventureOpposite}",
	200,
	90,
	"n*2+4",
	0,
	"Goop Spray",
	false
).addAction({
	name: "Goop Spray",
	element: "Untyped",
	description: "Slow a single foe",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let addedSlow = false;
		if (isCrit) {
			addedSlow = addModifier(target, { name: "Slow", stacks: 3 });
			target.addStagger("elementMatchFoe");
		} else {
			addedSlow = addModifier(target, { name: "Slow", stacks: 2 });
		}
		if (addedSlow) {
			return `${target.getName(adventure.room.enemyIdMap)} is Slowed.`;
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
	name: "Tackle",
	element: "@{adventureOpposite}",
	description: "Deal the Ooze's element damage to a single foe",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 25;
		if (isCrit) {
			damage *= 2;
		}
		target.addStagger("elementMatchFoe");
		return dealDamage([target], user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: nextRandom
})
	.setFlavorText({ name: "Ooze's Element", value: "The Ooze's element will be the opposite of the current adventure." });
