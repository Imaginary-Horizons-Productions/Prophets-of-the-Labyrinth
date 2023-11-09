const { EnemyTemplate, CombatantReference } = require("../classes");
const { selectRandomFoe, selectNone, selectAllFoes, selectRandomOtherAlly } = require("../shared/actionComponents");
const { addBlock, addModifier } = require("../util/combatantUtil");
const { spawnEnemy } = require("../util/roomUtil");

const mechabee = require("./mechabee.js")

const PATTERN = {
	"Swarm Protocol": "V.E.N.O.Missile",
	"Assault Protocol": "V.E.N.O.Missile",
	"Sacrifice Protocol": "V.E.N.O.Missile",
	"Deploy Drone": "a random protocol",
	"V.E.N.O.Missile": "Deploy Drone"
}
function mechaQueenPattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Mecha Queen",
	"Darkness",
	500,
	100,
	"n*2+2",
	0,
	"a random protocol",
	true
).addAction({
	name: "Swarm Protocol",
	element: "Untyped",
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		// assumes mechaqueen is at enemy index 0 and that all other enemies are mechabees
		adventure.room.moves.forEach(move => {
			if (move.userReference.team === "enemy" && move.userReference.index !== 0) {
				move.name = "Call for Help";
				move.targets = [new CombatantReference("none", -1)];
			}
		});
		addBlock(user, isCrit ? 200 : 100);
		return "She prepares to Block and demands reinforcements!";
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "Assault Protocol",
	element: "Untyped",
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		// assumes mecha queen is at enemy index 0 and that all other enemies are mechabees
		const { targets: mechaqueensTargets } = adventure.room.moves.find(move => move.userReference.team === "enemy" && move.userReference.index === 0)
		adventure.room.moves.forEach(move => {
			if (move.userReference.team === "enemy" && move.userReference.index !== 0) {
				move.name = "Sting";
				move.targets = mechaqueensTargets;
			}
		});
		addBlock(user, isCrit ? 200 : 100);
		return "She prepares to Block and orders a full-on attack!";
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "Sacrifice Protocol",
	element: "Untyped",
	priority: 1,
	effect: ([target], user, isCrit, adventure) => {
		addBlock(user, isCrit ? 200 : 100);
		if (target) {
			const targetMove = adventure.room.moves.find(move => move.userReference.team === "enemy" && move.userReference.index === parseInt(target.title));
			targetMove.name = "Self-Destruct";
			targetMove.targets = selectAllFoes(adventure, target);
			return "She prepares to Block and employs desperate measures!";
		}
		return "She prepares to Block."
	},
	selector: selectRandomOtherAlly,
	needsLivingTargets: true,
	next: mechaQueenPattern
}).addAction({
	name: "Deploy Drone",
	element: "Untyped",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(mechabee, adventure);
		return "Another mechabee arrives.";
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "V.E.N.O.Missile",
	element: "Darkness",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		target.addStagger("elementMatchFoe");
		if (isCrit) {
			addModifier(target, { name: "Poison", stacks: 5 });
		} else {
			addModifier(target, { name: "Poison", stacks: 3 });
		}
		return `${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: mechaQueenPattern
});
