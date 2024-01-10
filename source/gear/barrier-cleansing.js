const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Cleansing Barrier",
	"Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} and cure a random debuff",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Earth",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			user.addStagger("elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedVigilance = addModifier(user, pendingVigilance);
		addModifier(user, evade);
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		let debuffWasRemoved = false;
		let rolledDebuff;
		if (userDebuffs.length > 0) {
			rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			debuffWasRemoved = removeModifier(user, { name: rolledDebuff, stacks: "all" });
		}
		return `${user.getName(adventure.room.enemyIdMap)}${addedVigilance ? " Vigilantly" : ""} prepares to Evade ${debuffWasRemoved ? ` and shrugs off ${rolledDebuff}` : ""}.`;
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Devoted Barrier", "Long Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);
