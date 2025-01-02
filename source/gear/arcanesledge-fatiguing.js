const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE, SAFE_DELIMITER } = require('../constants');
const { getModifierCategory } = require('../modifiers/_modifierDictionary');
const { changeStagger, removeModifier, dealDamage, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

const gearName = "Fatiguing Arcane Sledge";
module.exports = new GearTemplate(gearName,
	[
		["use", "Deal @{damage} @{essence} damage, inflict @{mod0Stacks} @{mod0}, and remove @{bonus} random buff from a single foe"],
		["Critical💥", "Buffs removed x @{critMultiplier}"]
	],
	"Support",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, bonus, critMultiplier, damage, modifiers: [impotence] } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		let pendingBuffRemovals = bonus;
		if (user.crit) {
			pendingBuffRemovals *= critMultiplier;
		}
		const targetBuffs = Object.keys(targets[0].modifiers).filter(modifier => getModifierCategory(modifier) === "Buff");
		const reciepts = addModifier(targets, { name: impotence.name, stacks: impotence.stacks.generator(user) });
		if (targetBuffs.length > 0) {
			for (let i = 0; i < pendingBuffRemovals; i++) {
				const selectedBuff = targetBuffs.splice(user.roundRns(`${gearName}${SAFE_DELIMITER}buffs`), 1);
				reciepts.push(...removeModifier(targets, { name: selectedBuff, stacks: "all" }));
			}
		}
		const pendingDamage = damage + user.getPower();
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(reciepts)));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Kinetic Arcane Sledge")
	.setCooldown(1)
	.setDamage(40)
	.setBonus(1)
	.setRnConfig({ buffs: 2 })
	.setModifiers({ name: "Impotence", stacks: { description: "2 + Bonus Speed / 10", generator: (user) => 2 + Math.floor(user.getBonusSpeed / 10) } });
