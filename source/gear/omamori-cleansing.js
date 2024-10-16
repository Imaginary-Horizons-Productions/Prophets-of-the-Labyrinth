const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { changeStagger, addProtection, getNames, addModifier } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');
const { listifyEN } = require('../util/textUtil');

module.exports = new GearTemplate("Cleansing Omamori",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{protection} protection, then shrug off a random debuff"],
		["Critical💥", "@{mod0} x@{critMultiplier}"]
	],
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [lucky], protection, critMultiplier } = module.exports;
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
			gainedEffects.push(getApplicationEmojiMarkdown("Lucky"));
		}

		const userEffects = [];
		if (gainedEffects.length > 0) {
			userEffects.push(`gains ${listifyEN(gainedEffects, false)}`);
		}

		const debuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (debuffs.length > 0) {
			const rolledDebuff = debuffs[user.roundRns[`Cleansing Omamori${SAFE_DELIMITER}debuffs`][0] % debuffs.length];
			const debuffWasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
			if (debuffWasRemoved) {
				userEffects.push(`is cured of ${rolledDebuff}`);
			}
		}
		return [`${getNames([user], adventure)[0]} ${listifyEN(userEffects, false)}.`];
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: true })
	.setSidegrades("Centering Omamori", "Devoted Omamori")
	.setModifiers({ name: "Lucky", stacks: 2 })
	.setProtection(50)
	.setDurability(10)
	.setRnConfig({ debuffs: 1 });
