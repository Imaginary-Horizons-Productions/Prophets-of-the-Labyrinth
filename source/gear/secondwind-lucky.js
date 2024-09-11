const { GearTemplate } = require('../classes');
const { gainHealth, changeStagger, addModifier, getNames } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lucky Second Wind",
	"Regain @{damage} hp; gain @{mod0Stacks} @{mod0}",
	"Healing x@{critMultiplier}",
	"Technique",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, critMultiplier, modifiers: [lucky] } = module.exports;
		let pendingHealing = user.getPower();
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		if (isCrit) {
			pendingHealing *= critMultiplier;
		}
		const resultSentences = [gainHealth(user, pendingHealing, adventure)];
		const addedLucky = addModifier([user], lucky).length > 0;
		if (addedLucky) {
			resultSentences.push(`${getNames([user], adventure)[0]} gains Lucky.`);
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "self", team: "none", needsLivingTargets: true })
	.setSidegrades("Cleansing Second Wind", "Soothing Second Wind")
	.setModifiers({ name: "Lucky", stacks: 1 })
	.setDurability(10)
	.setPower(0);
