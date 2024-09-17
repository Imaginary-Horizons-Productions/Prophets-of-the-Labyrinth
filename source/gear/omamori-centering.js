const { GearTemplate } = require('../classes');
const { changeStagger, addProtection, getNames, addModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Centering Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier, stagger } = module.exports;
		const hadStagger = user.stagger > 0;
		changeStagger([user], stagger);
		const pendingLucky = { ...lucky };
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingLucky.stacks *= critMultiplier;
		}
		addProtection([user], protection);
		const gainedEffects = ["protection"];
		const addedLucky = addModifier([user], pendingLucky).length > 0;
		if (addedLucky) {
			gainedEffects.push("Lucky");
		}
		const userName = getNames([user], adventure)[0];
		return `${userName} gains ${listifyEN(gainedEffects)}.${hadStagger ? ` ${userName} shrugs off some Stagger.` : ""}`;
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: true })
	.setSidegrades("Cleansing Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setStagger(-2)
	.setDurability(10);
