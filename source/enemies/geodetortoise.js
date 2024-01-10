const { EnemyTemplate } = require("../classes");
const { addModifier, dealDamage } = require("../util/combatantUtil");
const { selectRandomFoe, selectSelf, nextRandom } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");

module.exports = new EnemyTemplate("Geode Tortoise",
	"Earth",
	350,
	85,
	"6+n",
	0,
	"random",
	false
).addAction({
	name: "Bite",
	element: "Earth",
	description: `Deals ${getEmoji("Earth")} damage to a single foe`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = user.getPower() + 50;
		if (isCrit) {
			damage *= 2;
		}
		target.addStagger("elementMatchFoe");
		return dealDamage([target], user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: nextRandom
}).addAction({
	name: "Crystallize",
	element: "Untyped",
	description: "Gain protection and Power Up",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let addedPowerUp = false;
		user.protection += 25;
		if (isCrit) {
			addedPowerUp = addModifier(user, { name: "Power Up", stacks: 50 });
			user.addStagger("elementMatchAlly");
		} else {
			addedPowerUp = addModifier(user, { name: "Power Up", stacks: 25 });
		}
		return `It gains protection${addedPowerUp ? ` and is Powered Up` : ""}.`;
	},
	selector: selectSelf,
	needsLivingTargets: false,
	next: nextRandom
});
