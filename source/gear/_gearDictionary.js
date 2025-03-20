const { BuildError, GearTemplate, Gear, GearFamily, Delver, Adventure } = require("../classes");
const { getApplicationEmojiMarkdown, injectApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { getEmoji } = require("../util/essenceUtil");
const { italic } = require("discord.js");
const { ICON_CRITICAL } = require("../constants");
const { calculateTagContent } = require("../util/textUtil");

/** @type {Record<string, GearTemplate>} */
const GEAR = {};
/** @type {string[]} */
const GEAR_NAMES = [];

for (const file of [
	"_appease.js",
	"_greed.js",
	"arcane-sledge.js",
	"battle-standard.js",
	"blood-aegis.js",
	"bonfire-formationjs",
	"boots-of-comfort.js",
	"bounty-fist.js",
	"buckler.js",
	"carrot.js",
	"cauldron-stir.js",
	"cloak.js",
	"conjured-ice-pillar.js",
	"cursed-bag.js",
	"cursed-blade.js",
	"cursed-doll.js",
	"cursed-grimore.js",
	"cursed-scroll.js",
	"cursed-shield.js",
	"cursed-tome.js",
	"daggers.js",
	"deck-of-cards.js",
	"elemental-scroll.js",
	"enchantment-siphon.js",
	"encouragement.js",
	"fever-break.js",
	"flail.js",
	"flame-scythes.js",
	"flourish.js",
	"forbidden-knowledge.js",
	"greatsword.js",
	"heat-weaken.js",
	"herb-basket.js",
	"illumination.js",
	"lance-accelerating.js",
	"lance-base.js",
	"lance-bashing.js",
	"lance-juggernauts.js",
	"lance-taunting.js",
	"lifedrain-base.js",
	"lifedrain-fatiguing.js",
	"lifedrain-furious.js",
	"lifedrain-reapers.js",
	"lifedrain-thirsting.js",
	"lightningstaff-base.js",
	"lightningstaff-disenchanting.js",
	"lightningstaff-hexing.js",
	"longsword-base.js",
	"longsword-double.js",
	"longsword-lethal.js",
	"medicine-base.js",
	"medicine-hastening.js",
	"medicine-urgent.js",
	"medicskit-base.js",
	"medicskit-cleansing.js",
	"medicskit-warning.js",
	"midasstaff-accelerating.js",
	"midasstaff-base.js",
	"midasstaff-discounted.js",
	"mightygauntlet-accurate.js",
	"mightygauntlet-base.js",
	"mightygauntlet-hearty.js",
	"mightygauntlet-swift.js",
	"musket-base.js",
	"musket-discounted.js",
	"musket-hunters.js",
	"naturescaprice-accurate.js",
	"naturescaprice-base.js",
	"naturescaprice-hearty.js",
	"netlauncher-base.js",
	"netlauncher-tormenting.js",
	"netlauncher-thiefs.js",
	"overburnexplosion-accurate.js",
	"overburnexplosion-base.js",
	"overburnexplosion-unstoppable.js",
	"parryingdagger-base.js",
	"parryingdagger-devoted.js",
	"parryingdagger-hastening.js",
	"revealflaw-base.js",
	"revealflaw-distracting.js",
	"revealflaw-numbing.js",
	"ringofconquest-base.js",
	"ringofconquest-hearty.js",
	"ringofconquest-powerful.js",
	"ringofknowledge-accurate.js",
	"ringofknowledge-base.js",
	"ringofknowledge-swift.js",
	"sandstormformation-balanced.js",
	"sandstormformation-base.js",
	"sandstormformation-soothing.js",
	"scarf-base.js",
	"scarf-hearty.js",
	"scarf-powerful.js",
	"scarf-swift.js",
	"shadowofconfusion-base.js",
	"shadowofconfusion-incompatible.js",
	"shadowofconfusion-shattering.js",
	"shortsword-base.js",
	"shortsword-flanking.js",
	"shortsword-hexing.js",
	"shortsword-midass.js",
	"shortsword-vigilant.js",
	"smokescreen-base.js",
	"smokescreen-chaining.js",
	"smokescreen-double.js",
	"spikedshield-base.js",
	"spikedshield-furious.js",
	"spikedshield-reinforced.js",
	"steamwall-base.js",
	"steamwall-supportive.js",
	"steamwall-vigilant.js",
	"stick-base.js",
	"stick-convalescence.js",
	"stick-flanking.js",
	"stick-hunters.js",
	"stick-thiefs.js",
	"swordofthesun-base.js",
	"swordofthesun-thiefs.js",
	"swordofthesun-lethal.js",
	"tempestuouswrath-base.js",
	"tempestuouswrath-flanking.js",
	"tempestuouswrath-opportunists.js",
	"tornadoformation-base.js",
	"tornadoformation-charging.js",
	"tornadoformation-supportive.js",
	"trident-base.js",
	"trident-kinetic.js",
	"trident-staggering.js",
	"universalsolution-base.js",
	"universalsolution-centering.js",
	"universalsolution-tormenting.js",
	"vacuumimplosion-base.js",
	"vacuumimplosion-shattering.js",
	"vacuumimplosion-urgent.js",
	"vengefulvoid-base.js",
	"vengefulvoid-hexing.js",
	"vengefulvoid-numbing.js",
	"warcry-base.js",
	"warcry-flanking.js",
	"warcry-weakening.js",
	"warhammer-base.js",
	"warhammer-fatiguing.js",
	"warhammer-toxic.js",
	"watersstillness-accelerating.js",
	"watersstillness-base.js",
	"watersstillness-cleansing.js",
	"wavecrash-base.js",
	"wavecrash-disenchanting.js",
	"wavecrash-fatiguing.js",
	"windburst-base.js",
	"windburst-inspiring.js",
	"windburst-toxic.js",
	"wolfring-accurate.js",
	"wolfring-base.js",
	"wolfring-powerful.js",
	"wolfring-swift.js"
]) {
	/** @type {GearFamily} */
	const gearFamily = require(`./${file}`);
	if (gearFamily.skipUpgradeLinking) {
		gearFamily.base.upgrades = gearFamily.upgrades.map(gear => gear.name);
		for (const upgrade of gearFamily.upgrades) {
			upgrade.sidegrades = gearFamily.upgrades.map(gear => gear.name).filter(name => name !== upgrade.name);
		}
	}
	for (const gear of [gearFamily.base, ...gearFamily.upgrades]) {
		if (gear.name.toLowerCase() in GEAR) {
			throw new BuildError(`Duplicate gear name (${gear.name})`);
		}
		GEAR[gear.name.toLowerCase()] = gear;
		GEAR_NAMES.push(gear.name);
	}
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
			return null;
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
		} else if (type === "critical") {
			descriptionTexts.push(`${italic("Critical")}${ICON_CRITICAL}: ${injectApplicationEmojiMarkdown(description)}`);
		} else {
			descriptionTexts.push(`${italic(type)}: ${injectApplicationEmojiMarkdown(description)}`);
		}
	});
	let text = descriptionTexts.join("\n")
		.replace(/@{essence}/g, getEmoji(getGearProperty(gearName, "essence")));

	const scalings = getGearProperty(gearName, "scalings");
	for (const key in scalings) {
		const scaling = scalings[key];
		let replacement;
		if (typeof scalings[key] === "number") {
			replacement = scaling.toString();
		} else {
			replacement = scaling.description;
		}
		text = calculateTagContent(text, { [key]: replacement });
	}

	getGearProperty(gearName, "modifiers")?.forEach((modifier, index) => {
		if (!modifier.name.startsWith("unparsed")) {
			text = text.replace(new RegExp(`@{mod${index}}`, "g"), getApplicationEmojiMarkdown(modifier.name));
		}
		if (typeof modifier.stacks === "number") {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		} else {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks.description);
		}
	})

	return text;
}

/**
 * @param {string} gearName
 * @param {Delver} holder
 * @param {number | null} gearIndex for charges lookup if holder has multiple of same gear type
 * @param {Adventure} adventure
 */
function buildGearDescriptionWithHolderStats(gearName, holder, gearIndex, adventure) {
	if (!gearExists(gearName)) {
		return "";
	}
	const maxCharges = getGearProperty(gearName, "maxCharges");
	const moraleRequirement = getGearProperty(gearName, "moraleRequirement");
	const pactCost = getGearProperty(gearName, "pactCost");
	const cooldown = getGearProperty(gearName, "cooldown");
	const descriptionTexts = [];
	if (maxCharges !== Infinity) {
		descriptionTexts.push(`${italic("Remaining Charges")}: ${holder.gear[gearIndex].charges}`);
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
		} else if (type === "critical") {
			descriptionTexts.push(`${italic("Critical")}${ICON_CRITICAL}: ${description}`);
		} else {
			descriptionTexts.push(`${italic(type)}: ${description}`);
		}
	});
	let text = descriptionTexts.join("\n")
		.replace(/@{essence}/g, getEmoji(getGearProperty(gearName, "essence")));

	const scalings = getGearProperty(gearName, "scalings");
	for (const key in scalings) {
		const scaling = scalings[key];
		let value;
		if (typeof scaling === "number") {
			if (key === "bounces") {
				const loadedDiceCount = adventure.getArtifactCount("Loaded Dice");
				if (loadedDiceCount > 0) {
					value = `[${scaling + loadedDiceCount}]`;
				}
			}
			if (value === undefined) {
				value = scaling.toString();
			}
		} else {
			value = `[${scaling.calculate(holder).toString()}]`;
		}
		text = calculateTagContent(text, { [key]: value });
	}

	getGearProperty(gearName, "modifiers")?.forEach((modifier, index) => {
		if (!modifier.name.startsWith("unparsed")) {
			text = text.replace(new RegExp(`@{mod${index}}`, "g"), getApplicationEmojiMarkdown(modifier.name));
		}
		if (typeof modifier.stacks === "number") {
			text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		} else {
			text = text.replace(new RegExp(`<@{mod${index}Stacks}>`, "g"), `[${modifier.stacks.calculate(holder)}]`);
		}
	})

	return text;
}

module.exports = {
	GEAR_NAMES,
	gearExists,
	getGearProperty,
	buildGearRecord,
	buildGearDescription,
	buildGearDescriptionWithHolderStats
};
