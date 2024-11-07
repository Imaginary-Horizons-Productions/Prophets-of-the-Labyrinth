const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, changeStagger } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectAllOtherCombatants } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");

module.exports = new EnemyTemplate("Asteroid",
	"Earth",
	85,
	10,
	"2",
	0,
	"Fragment",
	false
).addAction({
	name: "Fragment",
	element: "Earth",
	description: `Inflict ${getEmoji("Earth")} damage to delver, and loses some health`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 30;
		const recoilDmg = 20;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, "elementMatchFoe");
		return dealDamage(targets, user, damage, false, user.element, adventure).concat(dealDamage([user], user, recoilDmg, true, "Untyped", adventure));
	},
	selector: selectRandomFoe,
	next: "random"
}).addAction({
	name: "Bolide Burst",
	element: "Earth",
	description: `Sacrifice self to attack all combatants with ${getEmoji("Earth")} damage equal to its remaining HP`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + user.hp;
		if (user.crit) {
			damage *= 2;
		}
		user.hp = 0;
		changeStagger(targets, "elementMatchFoe");
		return [...dealDamage(targets, user, damage, false, user.element, adventure), `${user.name} is downed.`];
	},
	selector: selectAllOtherCombatants,
	next: "random"
});
