const { GearTemplate } = require('../classes/index.js');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts, getCombatantCounters } = require('../util/combatantUtil.js');
const { essenceList } = require('../util/essenceUtil.js');

const gearName = "Urgent Sabotage Kit";
module.exports = new GearTemplate(gearName,
	[
		["use", "Afflict a foe with @{mod0Stacks} @{mod0} and @{mod1Stacks} stacks of a random vulnerability with priority"],
		["Critical💥", "@{mod0} and Vulnerability +@{bonus}"]
	],
	"Weapon",
	"Unaligned",
	350,
	([target], user, adventure) => {
		const { essence, modifiers: [torpidity, vulnerability], bonus } = module.exports;
		const pendingTorpidity = { ...torpidity };
		const pendingVulnerabilty = { stacks: vulnerability.stacks };
		if (user.crit) {
			pendingTorpidity.stacks += bonus;
			pendingVulnerabilty.stacks += bonus;
		}
		if (user.essence === essence) {
			changeStagger([target], user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const receipts = addModifier([target], pendingTorpidity);
		const ineligibleEssences = getCombatantCounters(target);
		const essencePool = essenceList(ineligibleEssences);
		if (essencePool.length > 0) {
			pendingVulnerabilty.name = `${essencePool[user.roundRns[`${gearName}${SAFE_DELIMITER}vulnerabilities`][0] % essencePool.length]} Vunlerability`;
			receipts.unshift(...addModifier([target], pendingVulnerabilty));
		}
		return generateModifierResultLines(combineModifierReceipts(receipts));
	}
).setSidegrades("Potent Sabotage Kit", "Shattering Sabotage Kit")
	.setTargetingTags({ type: "single", team: "foe" })
	.setModifiers({ name: "Torpidity", stacks: 2 }, { name: "unparsed random vulnerability", stacks: 3 })
	.setBonus(2) // Crit Torpidity and Vulnerability stacks
	.setCooldown(1)
	.setPriority(1)
	.setFlavorText({ name: "Eligible Vulnerabilities", value: "The rolled vulnerability won't be one the target is already countered by" })
	.setRnConfig({ "vulnerabilities": 1 });
