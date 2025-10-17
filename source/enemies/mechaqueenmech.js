const { EnemyTemplate } = require("../classes/index.js");
const { ESSENCE_MATCH_STAGGER_FOE } = require("../constants.js");
const { selectRandomFoe, selectNone, selectAllFoes, selectRandomOtherAlly, selectAllAllies } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, addProtection } = require("../util/combatantUtil.js");
const { getEmoji } = require("../util/essenceUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");

const drone = require("./mechabeedrone.js")

module.exports = new EnemyTemplate("Mecha Queen: Mech Mode",
	"Darkness",
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
	next: "Laser Array",
	combatFlavor: "The Queen demands reinforcements!"
}).addAction({
	name: "Formation Protocol",
	essence: "Unaligned",
	description: `Gain protection and grant @e{Swiftness} and @e{Empowerment} to all lower ranking mechabees`,
	priority: 1,
	effect: (targets, user, adventure) => {
		const filteredTargets = targets.filter(target => target.hp > 0 && target.name !== user.name);
		addProtection([user], user.crit ? 60 : 30);
		const receipts = addModifier(filteredTargets, { name: "Swiftness", stacks: 3 }).concat(addModifier(filteredTargets, { name: "Empowerment", stacks: 3 }));
		return [`${user.name} gains protection.`].concat(receipts);
	},
	selector: selectAllAllies,
	next: "Laser Array",
	combatFlavor: "The Queen personally optimizes the flight formation."
}).addAction({
	name: "Assault Protocol",
	essence: "Unaligned",
	description: "Gain protection and command all mechabees to Sting a foe",
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
	next: "Laser Array",
	combatFlavor: "The Queen orders a full-on attack!"
}).addAction({
	name: "Sacrifice Protocol",
	essence: "Unaligned",
	description: "Gain protection and command a Mechabee to Self-Destruct",
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
	next: "Laser Array",
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
	name: "Laser Array",
	essence: "Darkness",
	description: `Inflict ${getEmoji("Darkness")} damage on a foe`,
	priority: 0,
	effect: (targets, user, adventure) => {
		let pendingDamage = 125;
		changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		if (user.crit) {
			pendingDamage *= 2;
		}
		return dealDamage(targets, user, pendingDamage, false, "Darkness", adventure).results;
	},
	selector: selectRandomFoe,
	next: "Deploy Drone"
});
