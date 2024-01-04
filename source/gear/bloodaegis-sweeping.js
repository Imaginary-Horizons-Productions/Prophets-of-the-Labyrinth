const { GearTemplate } = require('../classes');
const { addBlock, payHP } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Sweeping Blood Aegis",
	"Pay @{hpCost} hp; gain @{block} block and intercept all later single target moves",
	"Block x@{critMultiplier}",
	"Pact",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, block, critMultiplier, hpCost } = module.exports;
		let pendingBlock = block;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingBlock *= critMultiplier;
		}
		addBlock(user, pendingBlock);

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
			return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${listifyEN(provokedTargets)} fall for the provocation.`;
		} else if (provokedTargets.length === 1) {
			return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${provokedTargets[0]} falls for the provocation.`;
		} else {
			return `Preparing to Block, ${payHP(user, hpCost, adventure)}`;
		}
	}
).setTargetingTags({ type: "all", team: "foe", needsLivingTargets: true })
	.setSidegrades("Charging Blood Aegis", "Reinforced Blood Aegis")
	.setDurability(15)
	.setHPCost(25)
	.setBlock(100);
