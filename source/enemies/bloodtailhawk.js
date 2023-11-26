const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRepeat } = require("../shared/actionComponents");
const { dealDamage } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

module.exports = new EnemyTemplate("Bloodtail Hawk",
	"Wind",
	200,
	105,
	"1",
	10,
	"Rake",
	false
).addAction({
	name: "Rake",
	element: "Wind",
	description: `Deals ${getEmoji("Wind")} damage to a single target`,
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 45;
		if (isCrit) {
			damage *= 2;
		}
		target.addStagger("elementMatchFoe");
		return dealDamage([target], user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: nextRepeat
});
