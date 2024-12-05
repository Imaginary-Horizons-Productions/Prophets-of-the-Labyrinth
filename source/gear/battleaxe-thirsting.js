const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, dealDamage, gainHealth, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Battleaxe",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; heal @{healing} HP on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier, healing } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, element, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		resultLines.push(gainHealth(user, healing * killCount, adventure));
		return resultLines.concat(generateModifierResultLines(addModifier([user], exposed)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Furious Battleaxe", "Reactive Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setCooldown(1)
	.setDamage(90)
	.setHealing(60);
