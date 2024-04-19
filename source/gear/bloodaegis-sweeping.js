const { GearTemplate } = require('../classes');
const { payHP, changeStagger, addProtection } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Blood Aegis",
	"Pay @{hpCost} hp; gain @{protection} protection and intercept all later single target moves",
	"Protection x@{critMultiplier}",
	"Pact",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, protection, critMultiplier, hpCost } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);

		const provokedTargets = [];
		const targetTeam = user.team === "delver" ? "enemy" : "delver";
		const userIndex = adventure.getCombatantIndex(user);
		adventure.moves.forEach(move => {
			if (move.userReference.team === targetTeam && move.targets.length === 1) {
				const target = adventure.getCombatant(move.userReference);
				move.targets = [{ team: user.team, index: userIndex }];
				provokedTargets.push(target.getName(adventure.room.enemyIdMap));
			}
		})

		if (provokedTargets.length > 1) {
			return `Gaining protection, ${payHP(user, hpCost, adventure)} ${listifyEN(provokedTargets, false)} fall for the provocation.`;
		} else if (provokedTargets.length === 1) {
			return `Gaining protection, ${payHP(user, hpCost, adventure)} ${provokedTargets[0]} falls for the provocation.`;
		} else {
			return `Gaining protection, ${payHP(user, hpCost, adventure)}`;
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Charging Blood Aegis", "Reinforced Blood Aegis")
	.setDurability(15)
	.setHPCost(25)
	.setProtection(100);
