const { GearTemplate } = require('../classes');
const { payHP } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Reinforced Blood Aegis",
	"Pay @{hpCost} hp; gain @{protection} protection and intercept a later single target move",
	"Protection x@{critMultiplier}",
	"Pact",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, protection, critMultiplier, hpCost } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		user.protection += pendingProtection;
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		if (targetMove.targets.length === 1) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			return `Gaining protection, ${payHP(user, hpCost, adventure)} ${target.getName(adventure.room.enemyIdMap)} falls for the provocation.`;
		} else {
			return `Gaining protection, ${payHP(user, hpCost, adventure)}`;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Charging Blood Aegis", "Sweeping Blood Aegis")
	.setDurability(15)
	.setHPCost(25)
	.setProtection(250);
