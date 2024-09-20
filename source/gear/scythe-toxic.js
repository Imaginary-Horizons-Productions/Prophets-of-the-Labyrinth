const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil.js');

module.exports = new GearTemplate("Toxic Scythe",
	[
		["use", "Strike a foe applying @{mod0Stacks} @{mod0} and @{damage} @{element} damage; instant death if foe is at or below @{bonus} HP"],
		["Critical💥", "Instant death threshold x@{critMultiplier}"]
	],
	"Weapon",
	"Darkness",
	350,
	([target], user, isCrit, adventure) => {
		const { element, modifiers: [poison], damage, bonus: hpThreshold, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let pendingHPThreshold = hpThreshold;
		if (user.element === element) {
			changeStagger([target], "elementMatchFoe");
		}
		if (isCrit) {
			pendingHPThreshold *= critMultiplier;
		}
		if (target.hp > pendingHPThreshold) {
			const resultLines = dealDamage([target], user, pendingDamage, false, element, adventure);
			const addedPoison = addModifier([target], poison).length > 0;
			if (addedPoison) {
				resultLines.push(`${getNames([target], adventure)[0]} gains ${getApplicationEmojiMarkdown("Poison")}.`);
			}
			return resultLines;
		} else {
			target.hp = 0;
			return [`${getNames([target], adventure)[0]} meets the reaper.`];
		}
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Lethal Scythe", "Unstoppable Scythe")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(15)
	.setDamage(40)
	.setBonus(99); // execute threshold
