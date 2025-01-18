const { EnemyTemplate } = require("../classes/index.js");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe, selectNone, selectAllFoes, selectRandomOtherAlly, selectAllAllies } = require("../shared/actionComponents.js");
const { addModifier, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");

const drone = require("./mechabeedrone.js")

module.exports = new EnemyTemplate("Mecha Queen: Bee Mode",
	"Earth",
	750,
	100,
	"n*2+2",
	0,
	"a random protocol",
	true
).addAction({
	name: "Swarm Protocol",
	essence: "Unaligned",
	description: `Gain protection and command all Mechabees to Call for Help`,
	priority: 1,
	effect: (targets, user, adventure) => {
		// assumes mechaqueen is at enemy index 0 and that all other enemies are mechabees
		adventure.room.moves.forEach(move => {
			if (move.userReference.team === "enemy" && move.userReference.index !== 0) {
				move.name = "Call for Help";
				move.targets = [];
			}
		});
		addProtection([user], user.crit ? 60 : 30);
		return [`${user.name} gains protection.`];
	},
	selector: selectNone,
	next: "V.E.N.O.Missile",
	combatFlavor: "The Queen demands reinforcements!"
}).addAction({
	name: "Assault Protocol",
	essence: "Unaligned",
	description: "Gain protection and command all Mechabees to Sting a foe",
	priority: 1,
	effect: (targets, user, adventure) => {
		// assumes mecha queen is at enemy index 0 and that all other enemies are mechabees
		const { targets: mechaqueensTargets } = adventure.room.findCombatantMove({ index: 0, team: "enemy" });
		adventure.room.moves.forEach(move => {
			if (move.userReference.team === "enemy" && move.userReference.index !== 0) {
				move.name = "Sting";
				move.targets = mechaqueensTargets;
			}
		});
		addProtection([user], user.crit ? 60 : 30);
		return [`${user.name} gains protection.`];
	},
	selector: selectRandomFoe,
	next: "V.E.N.O.Missile",
	combatFlavor: "The Queen orders a full-on attack!"
}).addAction({
	name: "Formation Protocol",
	essence: "Unaligned",
	description: `Gain protection and grant @e{Swiftness} and @e{Empowerment} to all lower ranking mechabees`,
	priority: 1,
	effect: (targets, user, adventure) => {
		const filteredTargets = targets.filter(target => target.hp > 0 && target.name !== user.name);
		addProtection([user], user.crit ? 60 : 30);
		const receipts = addModifier(filteredTargets, { name: "Swiftness", stacks: 3 }).concat(addModifier(filteredTargets, { name: "Empowerment", stacks: 3 }));
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	},
	selector: selectAllAllies,
	next: "V.E.N.O.Missile",
	combatFlavor: "The Queen personally optimizes the flight formation."
}).addAction({
	name: "Sacrifice Protocol",
	essence: "Unaligned",
	description: "Gain protection and command a mechabee to Self-Destruct",
	priority: 1,
	effect: ([target], user, adventure) => {
		addProtection([user], user.crit ? 60 : 30);
		if (target) {
			const targetMove = adventure.room.findCombatantMove({ index: parseInt(target.id), team: "enemy" });
			targetMove.name = "Self-Destruct";
			targetMove.targets = selectAllFoes(target, adventure);
		}
		return [`${user.name} gains protection.`];
	},
	selector: selectRandomOtherAlly,
	next: "V.E.N.O.Missile",
	combatFlavor: "The Queen employs desperate measures!"
}).addAction({
	name: "Deploy Drone",
	essence: "Unaligned",
	description: "Summon a mechabee",
	priority: 0,
	effect: (targets, user, adventure) => {
		spawnEnemy(drone, adventure, true);
		return ["Another mechabee arrives."];
	},
	selector: selectNone,
	next: "a random protocol"
}).addAction({
	name: "V.E.N.O.Missile",
	essence: "Unaligned",
	description: `Inflict @e{Poison} on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		return generateModifierResultLines(addModifier(targets, { name: "Poison", stacks: user.crit ? 5 : 3 }));
	},
	selector: selectRandomFoe,
	next: "Deploy Drone"
});
