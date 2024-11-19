const { GearTemplate } = require('../classes');
const { dealDamage, removeModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');
const { surpassingPassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Surpassing Fever Break",
	[
		surpassingPassive,
		["use", `Deal <pending damage from @{mod0} and @{mod1}> @{element} damage to a foe then cure it of those debuffs`],
		["Critical💥", "@{mod0} and @{mod1} are not removed"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, adventure) => {
		const { element } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		let poisonDamage = 10;
		let frailDamage = 20;
		if (user.team === "delver") {
			const FUNNEL_BUFF = 2;
			const funnelCount = adventure.getArtifactCount("Spiral Funnel");
			poisonDamage += FUNNEL_BUFF * funnelCount;
			frailDamage += FUNNEL_BUFF * funnelCount;
		}
		const resultLines = [];
		const receipts = [];
		for (const target of targets) {
			const poisons = target.getModifierStacks("Poison");
			const frails = target.getModifierStacks("Frail");
			const pendingDamage = poisonDamage * (poisons ** 2 + poisons) / 2 + frailDamage * frails;
			resultLines.push(...dealDamage([target], user, pendingDamage, false, element, adventure));
			if (!user.crit && target.hp > 0) {
				receipts.push(...removeModifier(targets, { name: "Poison", stacks: "all" }).concat(removeModifier(targets, { name: "Frail", stacks: "all" })))
			}
		}
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(receipts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Organic Fever Break", "Urgent Fever Break")
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frail", stacks: 0 })
	.setDurability(5);
