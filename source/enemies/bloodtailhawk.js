const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRepeat } = require("../shared/actionComponents");
const { dealDamage } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("Bloodtail Hawk",
	"Wind",
	200,
	105,
	"1",
	30,
	"Rake",
	false
).addAction({
	name: "Rake",
	element: "Wind",
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
	next: nextRepeat
});
