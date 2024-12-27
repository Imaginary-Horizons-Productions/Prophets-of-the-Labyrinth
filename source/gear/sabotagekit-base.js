const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, getCombatantCounters } = require('../util/combatantUtil.js');
const { essenceList } = require('../util/essenceUtil.js');

const gearName = "Sabotage Kit";
module.exports = new GearTemplate(gearName,
	[
		["use", "Afflict a foe with @{mod0Stacks} @{mod0} and @{mod1Stacks} stacks of a random vulnerability"],
		["Critical💥", "@{mod0} and Vulnerability +@{bonus}"]
	],
	"Weapon",
	"Unaligned",
	200,
	([target], user, adventure) => {
		const { essence, modifiers: [torpidity, vulnerability], bonus } = module.exports;
		const pendingTorpidity = { ...torpidity };
		const pendingVulnerability = { stacks: vulnerability.stacks };
		if (user.crit) {
			pendingTorpidity.stacks += bonus;
			pendingVulnerability.stacks += bonus;
		}
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const receipts = addModifier([target], pendingTorpidity);
		const ineligibleEssences = getCombatantCounters(target);
		const essencePool = essenceList(ineligibleEssences);
		if (essencePool.length > 0) {
			pendingVulnerability.name = `${essencePool[user.roundRns[`${gearName}${SAFE_DELIMITER}vulnerabilities`][0] % essencePool.length]} Vulnerability`;
			receipts.unshift(...addModifier([target], pendingVulnerability));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setUpgrades("Potent Sabotage Kit", "Shattering Sabotage Kit", "Urgent Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe" })
	.setModifiers({ name: "Torpidity", stacks: 2 }, { name: "unparsed random vulnerability", stacks: 3 })
	.setBonus(2) // Crit Torpidity and Vulnerability stacks
	.setCooldown(1)
	.setFlavorText({ name: "Eligible Vulnerabilities", value: "The rolled vulnerability won't be one the target is already countered by" })
	.setRnConfig({ "vulnerabilities": 1 });
