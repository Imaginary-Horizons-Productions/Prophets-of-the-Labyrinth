const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants");
const { selectRandomFoe } = require("../shared/actionComponents");
const { dealDamage, changeStagger } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

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
	essence: "Wind",
	description: `Deal ${getEmoji("Wind")} damage to a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let damage = user.getPower() + 45;
		if (user.crit) {
			damage *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return dealDamage(targets, user, damage, false, user.essence, adventure).results;
	},
	selector: selectRandomFoe,
	next: "Rake"
});
