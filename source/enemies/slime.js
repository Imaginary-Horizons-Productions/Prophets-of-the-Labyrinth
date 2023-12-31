const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRandom } = require("../shared/actionComponents.js");
const { addModifier, dealDamage } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("@{adventure} Slime",
	"@{adventure}",
	200,
	90,
	"n*2+4",
	0,
	"Tackle",
	false
).addAction({
	name: "Tackle",
	element: "@{adventure}",
	description: "Deal the Slime's element damage to a single foe",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = user.getPower() + 25;
		if (isCrit) {
			damage *= 2;
		}
		target.addStagger("elementMatchFoe");
		return dealDamage([target], user, damage, false, adventure.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
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
})
	.setFlavorText({ name: "Slime's Element", value: "The Slime's element will match the current adventure." });
