const { GearTemplate } = require('../classes');
const { addModifier, payHP, changeStagger, addProtection, getNames } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Charging Blood Aegis",
	"Pay @{hpCost} hp; gain @{protection} protection, @{mod0Stacks} @{mod0}, intercept a later single target move",
	"Protection x@{critMultiplier}",
	"Pact",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [powerUp], protection, critMultiplier, hpCost } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([user], pendingProtection);
		const addedPowerUp = addModifier([user], powerUp).length > 0;
		const targetMove = adventure.room.moves.find(move => {
			const moveUser = adventure.getCombatant(move.userReference);
			return moveUser.name === target.name && moveUser.title === target.title;
		});
		const [userName, targetName] = getNames([user, target], adventure);
		if (targetMove.targets.length === 1) {
			targetMove.targets = [{ team: user.team, index: adventure.getCombatantIndex(user) }];
			return `Gaining protection, ${payHP(user, hpCost, adventure)}${addedPowerUp ? ` ${userName} is Powered Up.` : ""} ${targetName} falls for the provocation.`;
		} else {
			return `Gaining protection, ${payHP(user, hpCost, adventure)}${addedPowerUp ? ` ${userName} is Powered Up.` : ""}`;
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Reinforced Blood Aegis", "Sweeping Blood Aegis")
	.setModifiers({ name: "Power Up", stacks: 25 })
	.setDurability(15)
	.setHPCost(25)
	.setProtection(125);
