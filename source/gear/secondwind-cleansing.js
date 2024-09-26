const { GearTemplate } = require('../classes');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { gainHealth, removeModifier, changeStagger } = require('../util/combatantUtil');
const { getApplicationEmojiMarkdown } = require('../util/graphicsUtil');

module.exports = new GearTemplate("Cleansing Second Wind",
	[
		["use", "Regain @{damage} HP and shrug off a random debuff"],
		["Critical💥", "Healing x@{critMultiplier}"]
	],
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const resultLines = [gainHealth(user, pendingHealing, adventure)];
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (userDebuffs.length > 0) {
			const rolledDebuff = userDebuffs[adventure.generateRandomNumber(userDebuffs.length, "battle")];
			const debuffWasRemoved = removeModifier([user], { name: rolledDebuff, stacks: "all" }).length > 0;
			if (debuffWasRemoved) {
				resultLines.push(`${user.name} shrugs off ${getApplicationEmojiMarkdown(rolledDebuff)}.`);
			}
		}
		return resultLines;
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Lucky Second Wind", "Soothing Second Wind")
	.setDurability(10)
	.setDamage(0);
