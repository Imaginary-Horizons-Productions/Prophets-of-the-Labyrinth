const { GearTemplate } = require("../classes");
const { addModifier, changeStagger, getNames, enterStance } = require("../util/combatantUtil");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { joinAsStatement, listifyEN } = require("../util/textUtil");
const { accuratePassive } = require("./descriptions/passives");

module.exports = new GearTemplate("Accurate Iron Fist Stance",
	[
		accuratePassive,
		["use", "Gain @{mod0Stacks} @{mod0} (exit other stances)"],
		["Critical💥", "Inflict @{mod1Stacks} @{mod1} on all enemies"]
	],
	"Technique",
	"Light",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [ironFistStance, frail] } = module.exports;
		if (user.element === element) {
			changeStagger([user], "elementMatchAlly");
		}
		const { didAddStance, stancesRemoved } = enterStance(user, ironFistStance);
		const userEffects = [];
		if (didAddStance) {
			userEffects.push(`gains ${getApplicationEmojiMarkdown("Iron Fist Stance")}`);
		}
		if (stancesRemoved.length > 0) {
			userEffects.push(`exits ${stancesRemoved.map(stance => getApplicationEmojiMarkdown(stance)).join("")}`);
		}

		const resultLines = [];
		if (userEffects.length > 0) {
			resultLines.push(`${getNames([user], adventure)[0]} ${listifyEN(userEffects, false)}.`);
		}

		if (isCrit) {
			const foeTeam = user.team === "delver" ? adventure.room.enemies.filter(foe => foe.hp > 0) : adventure.delvers;
			const frailedTargets = addModifier(foeTeam, frail);
			if (frailedTargets.length > 0) {
				resultLines.push(joinAsStatement(false, getNames(frailedTargets, adventure), "gains", "gain", `${getApplicationEmojiMarkdown("Frail")}.`));
			}
		}

		return resultLines;
	}
).setTargetingTags({ type: "self", team: "ally", needsLivingTargets: false })
	.setSidegrades("Lucky Iron Fist Stance", "Organic Iron Fist Stance")
	.setModifiers({ name: "Iron Fist Stance", stacks: 1 }, { name: "Frail", stacks: 4 })
	.setBonus(45) // Punch damage boost
	.setDurability(10)
	.setCritRate(5)
	.setFlavorText({ name: "Iron Fist Stance", value: "Changes Punch's element to the bearer's and increases its damage by @{bonus} per stack" });
