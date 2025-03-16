const { EnemyTemplate } = require("../classes");
const { ESSENCE_MATCH_STAGGER_ALLY } = require("../constants");
const { selectRandomAlly, selectNone } = require("../shared/actionComponents");
const { changeStagger, generateModifierResultLines, addModifier } = require("../util/combatantUtil");
const { spawnEnemy } = require("../util/roomUtil");

module.exports = new EnemyTemplate("Unkind Corvus",
	"Darkness",
	150,
	101,
	"4",
	0,
	"Never-touched",
	false
).addAction({
	name: "Never-touched",
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
	next: "random"
}).addAction({
	name: "More Oversight",
	essence: "Unaligned",
	description: "Grant an ally (potentially self) @e{Vigilance}",
	priority: 0,
	effect: (targets, user, adventure) => {
		const pendingVigilance = { name: "Vigilance", stacks: 1 };
		if (user.crit) {
			pendingVigilance.stacks *= 2;
		}
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		return generateModifierResultLines(addModifier(targets, pendingVigilance));
	},
	selector: selectRandomAlly,
	next: "Never-touched"
}).addAction({
	name: "More Unkindness",
	essence: "Unaligned",
	description: "Summon another Corvus",
	priority: 0,
	effect: (targets, user, adventure) => {
		spawnEnemy(module.exports.setMaxHP(90), adventure, true);
		return ["Another Corvus arrives. The Unkindness grows"];
	},
	selector: selectNone,
	next: "More Oversight"
}).addStartingModifier("Cowardice", 1);
