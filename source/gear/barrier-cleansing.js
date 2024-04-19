const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { removeModifier, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { listifyEN } = require('../util/textUtil.js');

module.exports = new GearTemplate("Cleansing Barrier",
	"Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} and cure a random debuff",
	"@{mod1} x@{critMultiplier}",
	"Spell",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [evade, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		const addedModifiers = [];
		const addedVigilance = addModifier([user], pendingVigilance).length > 0;
		if (addedVigilance) {
			addedModifiers.push("Vigilance");
		}
		const addedEvade = addModifier([user], evade).length > 0;
		if (addedEvade) {
			addedModifiers.push("Evade");
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		let debuffWasRemoved = false;
		let rolledDebuff;
		if (userDebuffs.length > 0) {
			rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			debuffWasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
		}
		if (addedModifiers.length > 0) {
			return `${getNames([user], adventure)[0]} gains ${listifyEN(addedModifiers)}${debuffWasRemoved ? ` and shrugs off ${rolledDebuff}` : ""}.`;
		} else if (debuffWasRemoved) {
			return `${getNames([user], adventure)[0]} shrugs off ${rolledDebuff}.`;
		} else {
			return "But nothing happened.";
		}
	}
).setTargetingTags({ type: "self", team: "any", needsLivingTargets: false })
	.setSidegrades("Devoted Barrier", "Long Barrier")
	.setModifiers({ name: "Evade", stacks: 3 }, { name: "Vigilance", stacks: 1 })
	.setDurability(5);
