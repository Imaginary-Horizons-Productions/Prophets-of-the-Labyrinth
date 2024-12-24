const { GearTemplate } = require('../classes/index.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, getCombatantCounters } = require('../util/combatantUtil.js');
const { essenceList } = require('../util/essenceUtil.js');

const gearName = "Potent Sabotage Kit";
module.exports = new GearTemplate(gearName,
	[
		["use", "Afflict a foe with @{mod0Stacks} @{mod0} and @{mod1Stacks} stacks of a random vulnerability"],
		["Critical💥", "Slow and Vulnerabiity +@{bonus}"]
	],
	"Weapon",
	"Unaligned",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [slow, vulnerability], bonus } = module.exports;
		const pendingSlow = { ...slow };
		const pendingVulnerability = { stacks: vulnerability.stacks };
		if (user.crit) {
			pendingSlow.stacks += bonus;
			pendingVulnerability.stacks += bonus;
		}
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const receipts = addModifier([target], pendingSlow);
		const ineligibleEssences = getCombatantCounters(target);
		const essencePool = essenceList(ineligibleEssences);
		if (essencePool.length > 0) {
			pendingVulnerability.name = `${essencePool[user.roundRns[`${gearName}${SAFE_DELIMITER}vulnerabilities`][0] % essencePool.length]} Vulnerability`;
			receipts.unshift(...addModifier([target], pendingVulnerability));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setSidegrades("Shattering Sabotage Kit", "Urgent Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe" })
	.setModifiers({ name: "Slow", stacks: 3 }, { name: "unparsed random vulnerability", stacks: 4 })
	.setBonus(2) // Crit Slow and Vulnerability stacks
	.setCooldown(1)
	.setFlavorText({ name: "Eligible Vulnerabilities", value: "The rolled vulnerability won't be one the target is already countered by" })
	.setRnConfig({ "vulnerabilities": 1 });
