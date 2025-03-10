const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectMultipleRandomFoes, selectNone, selectRandomFoe } = require("../shared/actionComponents");
const { generateModifierResultLines, addModifier, dealDamage, changeStagger } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new EnemyTemplate("Gust Wolf",
	"Wind",
	150,
	105,
	"3",
	0,
	"Coiled Stance",
	false
).addAction({
	name: "Coiled Stance",
	essence: "Unaligned",
	description: "Gain @e{Empowerment}; use Bounding Frenzy next turn",
	priority: 1,
	effect: ([target], user, adventure) => {
		const pendingEmpowerment = { name: "Empowerment", stacks: 25 };
		if (user.crit) {
			pendingEmpowerment.stacks *= 2;
		}
		changeStagger([user], ESSENCE_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier([user], pendingEmpowerment));
	},
	selector: selectNone,
	next: "Bounding Frenzy"
}).addAction({
	name: "Bounding Frenzy",
	essence: "Wind",
	description: `Deal ${getEmoji("Wind")} damage to multiple foes`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingDamage = 25;
		if (user.crit) {
			pendingDamage *= 2;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, "Wind", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines;
	},
	selector: selectMultipleRandomFoes(3),
	next: "random"
}).addAction({
	name: "Gnaw",
	essence: "Wind",
	description: `Deal ${getEmoji("Wind")} to a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingDamage = 60;
		if (user.crit) {
			pendingDamage *= 2;
		}
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, "Wind", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines;
	},
	selector: selectRandomFoe,
	next: "random"
});
