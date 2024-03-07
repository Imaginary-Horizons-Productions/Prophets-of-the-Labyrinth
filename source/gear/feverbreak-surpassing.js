const { GearTemplate } = require('../classes');
const { dealDamage, removeModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');
const { SURPASSING_VALUE } = require('../constants');

module.exports = new GearTemplate("Surpassing Fever Break",
    "Deals @{element} damage to a foe, equal to damage that is pending from any Poison and Frail on them, and then removes those debuffs. Also, increase your damage cap by @{bonus}",
    "Poison and Frail not removed",
    "Spell",
    "Darkness",
    350,
    ([target], user, isCrit, adventure) => {
        const { element } = module.exports;
        const funnelCount = adventure.getArtifactCount("Spiral Funnel");
        const poisons = target.getModifierStacks("Poison");
        const frails = target.getModifierStacks("Frail");
        let pendingDamage = (10 + 5 * funnelCount) * (poisons ** 2 + poisons) / 2 + (20 + 5 * funnelCount) * frails;
        let cleanseText = "";
        if (user.element === element) {
            target.addStagger("elementMatchFoe");
        }
        let removedDebuffs = [];
        if (!isCrit) {
            if (removeModifier(target, { name: "Poison", stacks: "all" })) {
                removedDebuffs.push("Poison");
            }
            if (removeModifier(target, { name: "Frail", stacks: "all" })) {
                removedDebuffs.push("Frail");
            }
            if (removedDebuffs.length > 0) {
                cleanseText = `${target.getName(adventure.room.enemyIdMap)} is cured of ${removedDebuffs.join(" and ")}.`;
            }
        }
        return `${dealDamage([target], user, pendingDamage, false, element, adventure)}${cleanseText}`;
    }
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
    .setSidegrades("Organic Fever Break", "Urgent Fever Break")
    .setDurability(5)
	.setBonus(SURPASSING_VALUE);
