const { EnemyTemplate } = require("../classes");
const { selectRandomFoe, nextRepeat } = require("../shared/actionComponents");
const { dealDamage, addModifier } = require("../util/combatantUtil");

module.exports = new EnemyTemplate("Bloodtail Hawk",
	"Wind",
	200,
	105,
	1,
	30,
	"Rake",
	false
).addAction({
	name: "Rake",
	element: "Wind",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		let damage = 50;
		if (isCrit) {
			damage *= 2;
		}
		addModifier(target, { name: "Stagger", stacks: 1 });
		return dealDamage([target], user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: nextRepeat
});
