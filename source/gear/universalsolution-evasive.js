const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { changeStagger, addModifier, removeModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

const gearName = "Evasive Universal Solution";
module.exports = new GearTemplate(gearName,
	[
		["use", "Transfer a random 2 of your debuffs to a single foe, then gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "Transfer all your debuffs instead"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [poison, evade] } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		const addReciepts = [];
		if (user.crit) {
			for (const debuff of userDebuffs) {
				addReciepts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				removeModifier([user], { name: debuff, stacks: "all" });
			}
		} else {
			for (let i = 0; i < 2; i++) {
				if (userDebuffs.length < 1) {
					break;
				}
				const [debuff] = userDebuffs.splice(user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
				addReciepts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				removeModifier([user], { name: debuff, stacks: "all" });
			}
		}
		return generateModifierResultLines(combineModifierReceipts(addReciepts.concat(addModifier([user], poison), addModifier([user], evade))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Centering Universal Solution", "Harmful Universal Solution")
	.setModifiers({ name: "Poison", stacks: 3 }, { name: "Evade", stacks: 2 })
	.setDurability(10)
	.setRnConfig({ "debuffs": 2 });
