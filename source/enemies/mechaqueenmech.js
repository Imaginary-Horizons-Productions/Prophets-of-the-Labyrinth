const { EnemyTemplate } = require("../classes/index.js");
const { selectRandomFoe, selectNone, selectAllFoes, selectRandomOtherAlly, selectAllAllies } = require("../shared/actionComponents.js");
const { addModifier, dealDamage, changeStagger, addProtection, combineModifierReceipts } = require("../util/combatantUtil.js");
const { spawnEnemy } = require("../util/roomUtil.js");

const drone = require("./mechabeedrone.js")

module.exports = new EnemyTemplate("Mecha Queen: Mech Mode",
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
	description: `Gain protection and command all Mechabees to Call for Help`,
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		// assumes mechaqueen is at enemy index 0 and that all other enemies are mechabees
		adventure.room.moves.forEach(move => {
			if (move.userReference.team === "enemy" && move.userReference.index !== 0) {
				move.name = "Call for Help";
				move.targets = [];
			}
		});
		addProtection([user], isCrit ? 60 : 30);
		return [`${user.name} gains protection.`];
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: "Laser Array",
	combatFlavor: "The Queen demands reinforcements!"
}).addAction({
	name: "Formation Protocol",
	element: "Untyped",
	description: `Gain protection and grant @e{Quicken} and @e{Power Up} to all lower ranking mechabees`,
	priority: 1,
	effect: (targets, user, isCrit, adventure) => {
		const filteredTargets = targets.filter(target => target.hp > 0 && target.name !== user.name);
		addProtection([user], isCrit ? 60 : 30);
		const receipts = addModifier(filteredTargets, { name: "Quicken", stacks: 3 }).concat(addModifier(filteredTargets, { name: "Power Up", stacks: 3 }));
		return [`${user.name} gains protection.`].concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	},
	selector: selectAllAllies,
	needsLivingTargets: false,
	next: "Laser Array",
	combatFlavor: "The Queen personally optimizes the flight formation."
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
		addProtection([user], isCrit ? 60 : 30);
		return [`${user.name} gains protection.`];
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Laser Array",
	combatFlavor: "The Queen orders a full-on attack!"
}).addAction({
	name: "Sacrifice Protocol",
	element: "Untyped",
	description: "Gain protection and command a Mechabee to Self-Destruct",
	priority: 1,
	effect: ([target], user, isCrit, adventure) => {
		addProtection([user], isCrit ? 60 : 30);
		if (target) {
			const targetMove = adventure.room.moves.find(move => move.userReference.team === "enemy" && move.userReference.index === parseInt(target.id));
			targetMove.name = "Self-Destruct";
			targetMove.targets = selectAllFoes(target, adventure);
		}
		return [`${user.name} gains protection.`];
	},
	selector: selectRandomOtherAlly,
	needsLivingTargets: true,
	next: "Laser Array",
	combatFlavor: "The Queen employs desperate measures!"
}).addAction({
	name: "Deploy Drone",
	element: "Untyped",
	description: "Summon a Mechabee",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		spawnEnemy(drone, adventure);
		return ["Another mechabee arrives."];
	},
	selector: selectNone,
	needsLivingTargets: false,
	next: "a random protocol"
}).addAction({
	name: "Laser Array",
	element: "Darkness",
	description: "Inflict Darkness damage on a single foe",
	priority: 0,
	effect: (targets, user, isCrit, adventure) => {
		let pendingDamage = 125;
		changeStagger(targets, "elementMatchFoe");
		if (isCrit) {
			pendingDamage *= 2;
		}
		return dealDamage(targets, user, pendingDamage, false, "Darkness", adventure);
	},
	selector: selectRandomFoe,
	needsLivingTargets: false,
	next: "Deploy Drone"
});
