const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, addModifier, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lucky Scutum",
	"Grant @{protection} protection to an ally and yourself and gain @{mod0Stacks} @{mod0}",
	"Protection x@{critMultiplier}",
	"Armor",
	"Fire",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
		let pendingProtection = protection;
		if (user.element === element) {
			changeStagger([target, user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingProtection *= critMultiplier;
		}
		addProtection([target, user], pendingProtection);
		const addedLucky = addModifier([user], lucky).length > 0;
		const [targetName, userName] = getNames([target, user], adventure);
		return `${targetName} and ${userName} gain protection.${addedLucky ? ` ${userName} gains Lucky.` : ""}`;
	}
).setTargetingTags({ type: "single", team: "ally", needsLivingTargets: true })
	.setSidegrades("Guarding Scutum", "Sweeping Scutum")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setDurability(15)
	.setProtection(75);
