const { BuildError, GearTemplate, Gear, Delver, Adventure } = require("../classes");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { getEmoji } = require("../util/essenceUtil");
const { italic } = require("discord.js");
const { calculateTagContent } = require("../util/textUtil");

/** @type {Record<string, GearTemplate>} */
const GEAR = {};
/** @type {string[]} */
const GEAR_NAMES = [];

for (const file of [
	"_appease.js",
	"_greed.js",
	"_punch-base.js",
	"battlestandard-base.js",
	"battlestandard-tormenting.js",
	"battlestandard-thiefs.js",
	"bonfireformation-base.js",
	"bonfireformation-charging.js",
	"bonfireformation-hastening.js",
	"bootsofcomfort-accurate.js",
	"bootsofcomfort-base.js",
	"bootsofcomfort-hearty.js",
	"bootsofcomfort-powerful.js",
	"buckler-base.js",
	"buckler-guarding.js",
	"buckler-supportive.js",
	"cloak-accurate.js",
	"cloak-base.js",
	"cloak-powerful.js",
	"conjuredicearmaments-base.js",
	"conjuredicearmaments-supportive.js",
	"conjuredicearmaments-vigilant.js",
	"enchantmentsiphon-base.js",
	"enchantmentsiphon-flanking.js",
	"enchantmentsiphon-tormenting.js",
	"feverbreak-base.js",
	"feverbreak-fatiguing.js",
	"feverbreak-unstoppable.js",
	"flail-base.js",
	"flail-bouncing.js",
	"flail-incompatible.js",
	"greatsword-base.js",
	"greatsword-chaining.js",
	"greatsword-distracting.js",
	"longsword-base.js",
	"longsword-double.js",
	"longsword-lethal.js",
	"mightygauntlet-accurate.js",
	"mightygauntlet-base.js",
	"mightygauntlet-hearty.js",
	"mightygauntlet-swift.js",
	"netlauncher-base.js",
	"netlauncher-kinetic.js",
	"netlauncher-staggering.js",
	"parryingdagger-base.js",
	"parryingdagger-devoted.js",
	"parryingdagger-hastening.js",
	"revealflaw-base.js",
	"revealflaw-distracting.js",
	"revealflaw-numbing.js",
	"sandstormformation-balanced.js",
	"sandstormformation-base.js",
	"sandstormformation-soothing.js",
	"scarf-base.js",
	"scarf-hearty.js",
	"scarf-powerful.js",
	"scarf-swift.js",
	"smokescreen-base.js",
	"smokescreen-chaining.js",
	"smokescreen-double.js",
	"spikedshield-base.js",
	"spikedshield-furious.js",
	"spikedshield-reinforced.js",
	"tornadoformation-base.js",
	"tornadoformation-charging.js",
	"tornadoformation-supportive.js",
	"warhammer-base.js",
	"warhammer-fatiguing.js",
	"warhammer-toxic.js",
	"wolfring-accurate.js",
	"wolfring-base.js",
	"wolfring-powerful.js",
	"wolfring-swift.js"
]) {
	const gear = require(`./${file}`);
	if (gear.name.toLowerCase() in GEAR) {
		throw new BuildError(`Duplicate gear name (${gear.name})`);
	}
	GEAR[gear.name.toLowerCase()] = gear;
	GEAR_NAMES.push(gear.name);
};

/** Checks if a type of gear with the given name exists
 * @param {string} gearName
 */
function gearExists(gearName) {
	return gearName.toLowerCase() in GEAR;
}

/** Lookup a static property for a type of gear
 * @param {string} gearName
 * @param {string} propertyName
 * @returns {unknown}
 */
function getGearProperty(gearName, propertyName) {
	if (gearExists(gearName)) {
		const template = GEAR[gearName.toLowerCase()];
		if (propertyName in template) {
			return template[propertyName];
		} else {
			console.error(`Property ${propertyName} not found on ${gearName}`);
		}
	} else {
		console.error(`Gear name ${gearName} not recognized`);
	}
}

/**
 * @param {string} gearName
 * @param {Adventure} adventure
 */
function buildGearRecord(gearName, adventure) {
	const template = GEAR[gearName.toLowerCase()];
	let charges = template.maxCharges;
	const shoddyPenalty = adventure.getChallengeIntensity("Shoddy Spellcraft");
	const shoddyDuration = adventure.getChallengeDuration("Shoddy Spellcraft");
	if (shoddyPenalty > 0 && shoddyDuration > 0) {
		charges = Math.ceil(charges * (100 - shoddyPenalty) / 100);
	}
	return new Gear(gearName, charges, template.maxHP, template.power, template.speed, template.critRate);
}

/** @param {string} gearName */
function buildGearDescription(gearName) {
	if (!gearExists(gearName)) {
		return "";
	}
	const cooldown = getGearProperty(gearName, "cooldown");
	const maxCharges = getGearProperty(gearName, "maxCharges");
	const moraleRequirement = getGearProperty(gearName, "moraleRequirement");
	const pactCost = getGearProperty(gearName, "pactCost");
	const descriptionTexts = [];
	if (maxCharges !== Infinity) {
		descriptionTexts.push(`${italic("Max Charges")}: ${maxCharges}`);
	} else if (moraleRequirement > 0) {
		descriptionTexts.push(`${italic("Morale Required")}: ${moraleRequirement}`);
	} else if (pactCost) {
		descriptionTexts.push(`${italic("Pact Cost")}: ${pactCost[1].replace(/@{pactCost}/g, pactCost[0])}`);
	} else if (cooldown !== undefined) {
		descriptionTexts.push(`${italic("Cooldown")}: ${cooldown} Round${cooldown === 1 ? "" : "s"}`);
	}
	getGearProperty(gearName, "descriptions").forEach(([type, description]) => {
		if (type === "use") {
			descriptionTexts.push(`${italic(`${getGearProperty(gearName, "stagger") ?? 0} Stagger`)}: ${description}`);
		} else {
			descriptionTexts.push(`${italic(type)}: ${description}`);
		}
	});
	let text = descriptionTexts.join("\n");

	text = text.replace(/@{damage}/g, `(${getGearProperty(gearName, "damage")} + Power)`)
		.replace(/@{protection}/g, `(${getGearProperty(gearName, "protection")} + Bonus HP / 5)`)
		.replace(/@{bonusSpeed}/g, "(Bonus Speed)");

	getGearProperty(gearName, "modifiers")?.forEach((modifier, index) => {
		if (!modifier.name.startsWith("unparsed")) {
			text = text.replace(new RegExp(`@{mod${index}}`, "g"), getApplicationEmojiMarkdown(modifier.name));
		}
		if (typeof modifier.stacks === "number") {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		} else {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), `(${modifier.stacks.description})`);
		}
	})

	return injectGearStats(text, gearName);
}

/**
 * @param {string} gearName
 * @param {number} gearIndex for charges lookup if holder has multiple of same gear type
 * @param {Delver} holder
 */
function buildGearDescriptionWithHolderStats(gearName, gearIndex, holder) {
	if (!gearExists(gearName)) {
		return "";
	}
	const gearRecord = holder.gear[gearIndex];
	const maxCharges = getGearProperty(gearName, "maxCharges");
	const moraleRequirement = getGearProperty(gearName, "moraleRequirement");
	const pactCost = getGearProperty(gearName, "pactCost");
	const cooldown = getGearProperty(gearName, "cooldown");
	const descriptionTexts = [];
	if (maxCharges !== Infinity) {
		descriptionTexts.push(`${italic("Remaining Charges")}: ${gearRecord.charges}`);
	} else if (moraleRequirement > 0) {
		descriptionTexts.push(`${italic("Morale Required")}: ${moraleRequirement}`);
	} else if (pactCost) {
		// Game Design: do not calculate Pact Cost for the current context; that should be player responsibility
		descriptionTexts.push(`${italic("Pact Cost")}: ${pactCost[1].replace(/@{pactCost}/g, pactCost[0])}`);
	} else if (cooldown !== undefined) {
		descriptionTexts.push(`${italic("Cooldown")}: ${cooldown} Round${cooldown === 1 ? "" : "s"}`);
	}
	getGearProperty(gearName, "descriptions").forEach(([type, description]) => {
		if (type === "use") {
			let totalStagger = getGearProperty(gearName, "stagger") ?? 0;
			if (getGearProperty(gearName, "essence") === holder.essence) {
				const targetingTags = getGearProperty(gearName, "targetingTags");
				if (targetingTags) {
					switch (targetingTags.team) {
						case "ally":
							totalStagger -= 1;
							break;
						case "foe":
							totalStagger += 2;
							break;
						case "any":
							totalStagger = "+2 or -1";
							break;
					}
				}
			}
			descriptionTexts.push(`${italic(`${totalStagger} Stagger`)}: ${description}`);
		} else if (!["upgradeDiff"].includes(type)) {
			descriptionTexts.push(`${italic(type)}: ${description}`);
		}
	});
	let text = descriptionTexts.join("\n");

	const damage = getGearProperty(gearName, "damage") + holder.getPower();
	text = text.replace(/@{damage}/g, `[${Math.floor(Math.min(damage, holder.getDamageCap()))}]`);

	const protection = getGearProperty(gearName, "protection") + Math.floor(holder.getBonusHP() / 5);
	text = text.replace(/@{protection}/g, `[${protection}]`);

	const bonusSpeed = holder.getBonusSpeed();
	text = text.replace(/@{bonusSpeed}/g, `[${Math.max(0, bonusSpeed)}]`);

	getGearProperty(gearName, "modifiers")?.forEach((modifier, index) => {
		if (!modifier.name.startsWith("unparsed")) {
			text = text.replace(new RegExp(`@{mod${index}}`, "g"), getApplicationEmojiMarkdown(modifier.name));
		}
		if (typeof modifier.stacks === "number") {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		} else {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), `[${modifier.stacks.generator(holder)}]`);
		}
	})

	return injectGearStats(text, gearName);
}

/**
 * @param {string} text
 * @param {string} gearName
 */
function injectGearStats(text, gearName) {
	text = text.replace(/@{essence}/g, getEmoji(getGearProperty(gearName, "essence")))
	return calculateTagContent(text, [
		"critMultiplier",
		"bonus",
		"bonus2",
		"healing",
		"maxHP",
		"power",
		"speed",
		"critRate"
	].map(property => ({ tag: property, count: getGearProperty(gearName, property) })));
}

module.exports = {
	GEAR_NAMES,
	gearExists,
	getGearProperty,
	buildGearRecord,
	buildGearDescription,
	buildGearDescriptionWithHolderStats,
	injectGearStats
};
