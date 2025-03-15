const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_FOE, ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectRandomFoe, selectRandomAlly } = require("../shared/actionComponents");
const { changeStagger, dealDamage, generateModifierResultLines, addModifier } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

module.exports = new EnemyTemplate("Pulsar Zebra",
	"Darkness",
	180,
	101,
	"4",
	0,
	"Pulse Flash",
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
		const { resultLines, survivors } = dealDamage(targets, user, pendingDamage, false, "Darkness", adventure);
		changeStagger(survivors, user, ESSENCE_MATCH_STAGGER_FOE);
		return resultLines.concat(generateModifierResultLines(addModifier(survivors, { name: "Weakness", stacks: 10 })));
	},
	selector: selectRandomFoe,
	next: "Pulse Fade"
}).addAction({
	name: "Pulse Fade",
	essence: "Unaligned",
	description: "Grant an ally (potentially self) @e{Evasion}",
	priority: 0,
	effect: (targets, user, adventure) => {
		const pendingEvasion = { name: "Evasion", stacks: 2 };
		if (user.crit) {
			pendingEvasion.stacks *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier(targets, pendingEvasion));
	},
	selector: selectRandomAlly,
	next: "Pulse Flash"
});
