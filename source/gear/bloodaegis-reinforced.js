const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { addBlock, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reinforced Blood Aegis",
	"Pay @{hpCost} hp; gain @{block} block and intercept a later single target move",
	"Block x@{critBonus}",
	"Pact",
	"Darkness",
	350,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, block, critBonus, hpCost } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(user, block);
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		if (targetMove.targets.length === 1) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${target.getName(adventure.room.enemyIdMap)} falls for the provocation.`;
		} else {
			return `Preparing to Block, ${payHP(user, hpCost, adventure)}`;
		}
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setSidegrades("Charging Blood Aegis", "Sweeping Blood Aegis")
	.setDurability(15)
	.setHPCost(25)
	.setBlock(250);
