const { GearTemplate } = require('../classes');
const { dealDamage, removeModifier } = require('../util/combatantUtil');
const { listifyEN } = require('../util/textUtil');
const { SURPASSING_VALUE } = require('../constants');

module.exports = new GearTemplate("Fever Break",
    "Deals to a foe, the damage that is pending from any Poison and Frail on them, and then removes those debuffs",
    "Poison and Frail not removed",
    "Spell",
    "Dark",
    350,
    ([target], user, isCrit, adventure) => {
        const funnelCount = adventure.getArtifactCount("Spiral Funnel");
        const { Poison, Frail } = target.modifiers;
        let pendingDamage = (10 + 5 * funnelCount) * (Poison ** 2 + Poison) / 2 + (20 + 5 * funnelCount) * Frail;
        let cleanseText = "";
        if (user.element === element) {
            target.addStagger("elementMatchFoe");
        }
        if (!isCrit) {
            removedDebuffs = [];
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
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
    .setUpgrades("Organic Fever Break", "Surpassing Fever Break", "Urgent Fever Break")
    .setDurability(5)
    .setDamage(0)
    .setPriority(1);
