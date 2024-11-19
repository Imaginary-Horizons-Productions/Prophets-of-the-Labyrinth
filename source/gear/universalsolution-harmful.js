const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { isDebuff } = require('../modifiers/_modifierDictionary');
const { changeStagger, addModifier, removeModifier, generateModifierResultLines, combineModifierReceipts, dealDamage } = require('../util/combatantUtil');

const gearName = "Harmful Universal Solution";
module.exports = new GearTemplate(gearName,
	[
		["use", "Inflict @{damage} @{element} damage and transfer a random 2 of your debuffs to a single foe, then gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Transfer all your debuffs instead"]
	],
	"Pact",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { element, modifiers: [poison], damage } = module.exports;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => isDebuff(modifier));
		if (user.crit) {
			const addReciepts = [];
			for (const debuff of userDebuffs) {
				addReciepts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				removeModifier([user], { name: debuff, stacks: "all" });
			}
			return dealDamage(targets, user, damage, false, element, adventure).concat(generateModifierResultLines(combineModifierReceipts(addReciepts.concat(addModifier([user], poison)))));
		} else {
			const addReciepts = [];
			for (let i = 0; i < 2; i++) {
				if (userDebuffs.length < 1) {
					break;
				}
				const [debuff] = userDebuffs.splice(user.roundRns[`${gearName}${SAFE_DELIMITER}debuffs`][i] % userDebuffs.length, 1);
				addReciepts.push(...addModifier(targets, { name: debuff, stacks: user.modifiers[debuff] }));
				removeModifier([user], { name: debuff, stacks: "all" });
			}
			return dealDamage(targets, user, damage, false, element, adventure).concat(generateModifierResultLines(combineModifierReceipts(addReciepts.concat(addModifier([user], poison)))));
		}
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Centering Universal Solution", "Evasive Universal Solution")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setDurability(10)
	.setDamage(50)
	.setRnConfig({ "debuffs": 2 });
