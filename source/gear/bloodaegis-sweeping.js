const { GearTemplate } = require('../classes/GearTemplate.js');
const { needsLivingTargets } = require('../shared/actionComponents.js');
const { removeModifier, addBlock, payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Blood Aegis",
	"Pay @{hpCost} hp; gain @{block} block and intercept all later single target moves",
	"Block x@{critBonus}",
	"Pact",
	"Darkness",
	350,
	needsLivingTargets((targets, user, isCrit, adventure) => {
		let { element, modifiers: [elementStagger], block, critBonus, hpCost } = module.exports;
		if (user.element === element) {
			removeModifier(user, elementStagger);
		}
		if (isCrit) {
			block *= critBonus;
		}
		addBlock(user, block);

		const provokedTargets = [];
		const targetTeam = user.team === "delver" ? "enemy" : "delver";
		const userIndex = user.findMyIndex(adventure);
		adventure.moves.forEach(move => {
			if (move.userReference.team === targetTeam && move.targets.length === 1) {
				const target = adventure.getCombatant(move.userReference);
				move.targets = [{ team: user.team, index: userIndex }];
				provokedTargets.push(target.getName(adventure.room.enemyIdMap));
			}
		})

		if (provokedTargets.length > 0) {
			return `Preparing to Block, ${payHP(user, hpCost, adventure)} ${provokedTargets.join(", ")} fall(s) for the provocation.`;
		} else {
			return `Preparing to Block, ${payHP(user, hpCost, adventure)}`;
		}
	})
).setTargetingTags({ target: "all", team: "enemy" })
	.setSidegrades("Charging Blood Aegis", "Heavy Blood Aegis")
	.setModifiers([{ name: "Stagger", stacks: 1 }])
	.setDurability(15)
	.setHPCost(25)
	.setBlock(100);
