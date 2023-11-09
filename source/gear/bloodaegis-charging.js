const { GearTemplate } = require('../classes');
const { addBlock, addModifier, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Charging Blood Aegis",
	"Pay @{hpCost} hp; gain @{block} block, @{mod0Stacks} @{mod0}, intercept a later single target move",
	"Block x@{critBonus}",
	"Pact",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		let { element, modifiers: [powerUp], block, critBonus, hpCost } = module.exports;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(user, block);
		addModifier(user, powerUp);
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		if (targetMove.targets.length === 1) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up. ${target.getName(adventure.room.enemyIdMap)} falls for the provocation.`;
		} else {
			return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${user.getName(adventure.room.enemyIdMap)} is Powered Up.`;
		}
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reinforced Blood Aegis", "Sweeping Blood Aegis")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setHPCost(25)
	.setBlock(125);
