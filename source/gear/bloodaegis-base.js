const { GearTemplate } = require('../classes');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { removeModifier, addBlock, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Blood Aegis",
	"Pay @{hpCost} hp; gain @{block} block and intercept a later single target move",
	"Block x@{critBonus}",
	"Pact",
	"Darkness",
	200,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
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
	.setUpgrades("Charging Blood Aegis", "Reinforced Blood Aegis", "Sweeping Blood Aegis")
	.setModifiers({ name: "Stagger", stacks: 1 })
	.setDurability(15)
	.setHPCost(25)
	.setBlock(125);
