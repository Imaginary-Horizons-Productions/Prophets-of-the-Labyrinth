const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, addProtection, generateModifierResultLines, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Hastening Parrying Dagger",
	[
		["use", "Gain @{protection} protection and @{mod0Stacks} @{mod0}"],
		["Critical💥", "@{mod0} x @{critMultiplier}, reduce your cooldowns by @{bonus}"]
	],
	"Defense",
	"Light",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [finesse], critMultiplier, protection, bonus } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingFinesse = { ...finesse };
		let didCooldown = false;
		if (user.crit) {
			pendingFinesse.stacks *= critMultiplier;
			user.gear?.forEach(gear => {
				if (gear.cooldown > 1) {
					didCooldown = true;
					gear.cooldown -= bonus;
				}
			})
		}
		addProtection([user], protection + Math.floor(user.getBonusHP() / 5));
		if (didCooldown) {
			return [`${user.name} gains protection and hastens their cooldowns.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
		} else {
			return [`${user.name} gains protection.`].concat(generateModifierResultLines(addModifier([user], pendingFinesse)));
		}
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Devoted Parrying Dagger")
	.setCooldown(1)
	.setProtection(75)
	.setModifiers({ name: "Finesse", stacks: 1 })
	.setBonus(1);
