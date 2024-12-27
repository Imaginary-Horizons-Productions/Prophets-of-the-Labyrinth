const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, dealDamage, gainHealth, changeStagger, generateModifierResultLines } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Thirsting Battleaxe",
	[
		["use", "Strike a foe for @{damage} @{essence} damage, gain @{mod0Stacks} @{mod0}; heal @{healing} HP on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [exposure], damage, critMultiplier, healing } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		const resultLines = dealDamage(targets, user, pendingDamage, false, essence, adventure);
		let killCount = 0;
		targets.forEach(target => {
			if (target.hp < 1) {
				killCount++
			}
		})
		resultLines.push(gainHealth(user, healing * killCount, adventure));
		return resultLines.concat(generateModifierResultLines(addModifier([user], exposure)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Furious Battleaxe", "Reactive Battleaxe")
	.setModifiers({ name: "Exposure", stacks: 1 })
	.setCooldown(1)
	.setDamage(90)
	.setHealing(60);
