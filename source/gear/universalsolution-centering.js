const { GearTemplate } = require('../classes');
const { SAFE_DELIMITER, ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, addModifier, removeModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

const gearName = "Centering Universal Solution";
module.exports = new GearTemplate(gearName,
	[
		["use", "Transfer a random 2 of your debuffs to a single foe then gain @{mod0Stacks} @{mod0}"],
		["Critical💥", "Transfer all your debuffs instead"]
	],
	"Pact",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [poison], stagger } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		const userDebuffs = Object.keys(user.modifiers).filter(modifier => getModifierCategory(modifier) === "Debuff");
		const hadStaggerToLose = user.stagger > 0;
		if (hadStaggerToLose) {
			changeStagger([user], user, stagger);
		}
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
		if (hadStaggerToLose) {
			return generateModifierResultLines(combineModifierReceipts(addReciepts.concat(addModifier([user], poison)))).concat(`${user.name} shrugs off some Stagger.`);
		} else {
			return generateModifierResultLines(combineModifierReceipts(addReciepts.concat(addModifier([user], poison))));
		}

	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Evasive Universal Solution", "Harmful Universal Solution")
	.setModifiers({ name: "Poison", stacks: 3 })
	.setStagger(-2)
	.setRnConfig({ "debuffs": 2 });
