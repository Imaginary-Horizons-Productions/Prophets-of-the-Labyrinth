const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, gainHealth, changeStagger } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Thirsting Battleaxe",
	[
		["use", "Strike a foe for @{damage} @{element} damage, gain @{mod0Stacks} @{mod0}; heal @{healing} HP on kill"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Fire",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [exposed], damage, critMultiplier, healing } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
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
		return resultLines.concat(addModifier([user], exposed));
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Furious Battleaxe", "Reactive Battleaxe")
	.setModifiers({ name: "Exposed", stacks: 1 })
	.setDurability(15)
	.setDamage(90)
	.setHealing(60);
