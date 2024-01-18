const { EnemyTemplate, CombatantReference } = require("../classes/index.js");
const { selectRandomFoe, selectNone, selectAllFoes, selectRandomOtherAlly, selectAllAllies } = require("../shared/actionComponents.js");
const { addModifier } = require("../util/combatantUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { listifyEN } = require("../util/textUtil.js");

const drone = require("./mechabeedrone.js")

const PATTERN = {
	"Swarm Protocol": "V.E.N.O.Missile",
	"Assault Protocol": "V.E.N.O.Missile",
	"Formation Protocol": "V.E.N.O.Missile",
	"Sacrifice Protocol": "V.E.N.O.Missile",
	"Deploy Drone": "a random protocol",
	"V.E.N.O.Missile": "Deploy Drone"
}
function mechaQueenPattern(actionName) {
	return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Mecha Queen: Bee Mode",
	"Earth",
	500,
	100,
	"n*2+2",
	0,
	"a random protocol",
	true
).addAction({
	name: "Swarm Protocol",
	element: "Untyped",
	description: `Gain protection and command all Mechabees to Call for Help`,
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		// assumes mechaqueen is at enemy index 0 and that all other enemies are mechabees
		adventure.room.moves.forEach(move => {
			if (move.userReference.team === "enemy" && move.userReference.index !== 0) {
				move.name = "Call for Help";
				move.targets = [new CombatantReference("none", -1)];
			}
		});
		user.protection += isCrit ? 60 : 30;
		return "She gains protection and demands reinforcements!";
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "Assault Protocol",
	element: "Untyped",
	description: "Gain protection and command all Mechabees to Sting a single foe",
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
		user.protection += isCrit ? 60 : 30;
		return "She gains protection and orders a full-on attack!";
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "Formation Protocol",
	element: "Untyped",
	description: "Gain protection and grant Quicken and Power Up to all lower ranking mechabees",
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		const modifierMap = {};
		targets.forEach(target => {
			if (target.hp > 0 && target.name !== user.name) {
				const targetName = target.getName(adventure.room.enemyIdMap);
				modifierMap[targetName] = [];
				const addedQuicken = addModifier(target, { name: "Quicken", stacks: 3 });
				if (addedQuicken) {
					modifierMap[targetName].push("Quicken");
				}
				const addedPowerUp = addModifier(target, { name: "Power Up", stacks: 3 });
				if (addedPowerUp) {
					modifierMap[targetName].push("Power Up");
				}
			}
		})
		user.protection += isCrit ? 60 : 30;
		return `She gains protection and tunes the flight formation to be more efficient! ${Object.entries(modifierMap).map(([targetName, modifiers]) => `${targetName} gains ${listifyEN(modifiers)}.`).join(" ")}`;
	},
	selector: selectAllAllies,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "Sacrifice Protocol",
	element: "Untyped",
	description: "Gain protection and command a Mechabee to Self-Destruct",
	priority: 1,
	effect: ([target], user, isCrit, adventure) => {
		user.protection += isCrit ? 60 : 30;
		if (target) {
			const targetMove = adventure.room.moves.find(move => move.userReference.team === "enemy" && move.userReference.index === parseInt(target.id));
			targetMove.name = "Self-Destruct";
			targetMove.targets = selectAllFoes(target, adventure);
			return "She gains protection and employs desperate measures!";
		}
		return "She gains protection."
	},
	selector: selectRandomOtherAlly,
	needsLivingTargets: true,
	next: mechaQueenPattern
}).addAction({
	name: "Deploy Drone",
	element: "Untyped",
	description: "Summon a Mechabee",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(drone, adventure);
		return "Another mechabee arrives.";
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: mechaQueenPattern
}).addAction({
	name: "V.E.N.O.Missile",
	element: "Untyped",
	description: "Inflict Poison on a single foe",
	priority: 0,
	effect: ([target], user, isCrit, adventure) => {
		target.addStagger("elementMatchFoe");
		let addedPoison = false;
		if (isCrit) {
			addedPoison = addModifier(target, { name: "Poison", stacks: 5 });
		} else {
			addedPoison = addModifier(target, { name: "Poison", stacks: 3 });
		}
		if (addedPoison) {
			return `${target.getName(adventure.room.enemyIdMap)} is Poisoned.`;
		} else {
			return "But nothing happened.";
		}
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: mechaQueenPattern
});
