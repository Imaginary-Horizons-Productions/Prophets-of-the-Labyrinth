const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectRandomFoe, selectRandomAlly } = require("../shared/actionComponents");
const { changeStagger, dealDamage, addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new EnemyTemplate("Pulsar Zebra",
	"Darkness",
	180,
	101,
	"4",
	0,
	"Pulse Fade",
	false
).addAction({
	name: "Pulse Flash",
	essence: "Darkness",
	description: `Inflict ${getEmoji("Darkness")} damage and @e{Weakness} on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingDamage = 40 + user.getPower();
		if (user.crit) {
			pendingDamage *= 2;
		}
		const { results, survivors } = dealDamage(targets, user, pendingDamage, false, "Darkness", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return results.concat(addModifier(survivors, { name: "Weakness", stacks: 5 }));
	},
	selector: selectRandomFoe,
	next: "Pulse Fade"
}).addAction({
	name: "Pulse Fade",
	essence: "Unaligned",
	description: "Grant an ally (potentially self) @e{Evasion}",
	priority: 0,
	effect: (targets, user, adventure) => {
		const pendingEvasion = { name: "Evasion", stacks: 1 };
		if (user.crit) {
			pendingEvasion.stacks *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		return addModifier(targets, pendingEvasion);
	},
	selector: selectRandomAlly,
	next: "Pulse Flash"
});
