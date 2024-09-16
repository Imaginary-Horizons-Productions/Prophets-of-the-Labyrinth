const { GearTemplate } = require('../classes');
const { dealDamage, removeModifier, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Urgent Fever Break",
	[
		["use", `Deal @{element} damage to a foe (with priority), equal to pending damage from @{mod0} and @{mod1}, then remove those debuffs`],
		["Critical💥", "@{mod0} and @{mod1} are not removed"]
	],
	"Spell",
	"Darkness",
	350,
	(targets, user, isCrit, adventure) => {
		const { element } = module.exports;
		const funnelCount = adventure.getArtifactCount("Spiral Funnel");
		const damagesByTargets = targets.map(target => {
			const poisons = target.getModifierStacks("Poison");
			const frails = target.getModifierStacks("Frail");
			return [target, (10 + 5 * funnelCount) * (poisons ** 2 + poisons) / 2 + (20 + 5 * funnelCount) * frails]
		})
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		const removedDebuffs = {};
		if (!isCrit) {
			getNames(removeModifier(targets, { name: "Poison", stacks: "all" })).forEach(curedName => {
				removedDebuffs[curedName] = ["Poison"];
			})
			getNames(removeModifier(targets, { name: "Frail", stacks: "all" })).forEach(curedName => {
				if (curedName in removedDebuffs) {
					removedDebuffs[curedName].push("Frail");
				} else {
					removedDebuffs[curedName] = ["Frail"];
				}
			})
		}
		return `${damagesByTargets.map(([target, pendingDamage]) => dealDamage([target], user, pendingDamage, false, element, adventure)).join(" ")} ${Object.entries(removedDebuffs).map(([name, debuffs]) => `${name} is cured of ${listifyEN(debuffs)}.`).join(" ")}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Organic Fever Break", "Surpassing Fever Break")
	.setModifiers({ name: "Poison", stacks: 0 }, { name: "Frail", stacks: 0 })
	.setDurability(5)
	.setPriority(1);
