const { EnemyTemplate } = require("../classes");
const { ELEMENT_MATCH_STAGGER_FOE } = require("../constants");
const { selectRandomFoe } = require("../shared/actionComponents");
const { dealDamage, changeStagger } = require("../util/combatantUtil");
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
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 45;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.element, adventure);
	},
	selector: selectRandomFoe,
	next: "Rake"
});
