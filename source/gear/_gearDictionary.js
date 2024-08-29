const { BuildError, GearTemplate, Gear, Delver } = require("../classes");
const { getModifierEmoji } = require("../modifiers/_modifierDictionary");
const { getEmoji } = require("../util/elementUtil");

/** @type {Record<string, GearTemplate>} */
const GEAR = {};
const GEAR_NAMES = [];

for (const file of [
	"_appease.js",
	"_greed.js",
	"_punch.js",
	"abacus-base.js",
	"abacus-sharpened.js",
	"abacus-thiefs.js",
	"abacus-unstoppable.js",
	"barrier-base.js",
	"barrier-cleansing.js",
	"barrier-devoted.js",
	"barrier-long.js",
	"battleaxe-base.js",
	"battleaxe-furious.js",
	"battleaxe-reactive.js",
	"battleaxe-thirsting.js",
	"bloodaegis-base.js",
	"bloodaegis-charging.js",
	"bloodaegis-reinforced.js",
	"bloodaegis-toxic.js",
	"bow-base.js",
	"bow-evasive.js",
	"bow-thiefs.js",
	"bow-unstoppable.js",
	"buckler-base.js",
	"buckler-devoted.js",
	"buckler-guarding.js",
	"buckler-reinforced.js",
	"cauldronstir-base.js",
	"cauldronstir-corrosive.js",
	"cauldronstir-sabotaging.js",
	"cauldronstir-toxic.js",
	"censer-base.js",
	"censer-staggering.js",
	"censer-thick.js",
	"censer-tormenting.js",
	"certainvictory-base.js",
	"certainvictory-hunters.js",
	"certainvictory-lethal.js",
	"certainvictory-reckless.js",
	"chainmail-base.js",
	"chainmail-wise.js",
	"cloak-accelerating.js",
	"cloak-accurate.js",
	"cloak-base.js",
	"cloak-long.js",
	"corrosion-base.js",
	"corrosion-fatesealing.js",
	"corrosion-harmful.js",
	"corrosion-shattering.js",
	"cursed-blade.js",
	"cursed-tome.js",
	"daggers-base.js",
	"daggers-sharpened.js",
	"daggers-slowing.js",
	"daggers-sweeping.js",
	"feverbreak-base.js",
	"feverbreak-organic.js",
	"feverbreak-surpassing.js",
	"feverbreak-urgent.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-midass.js",
	"firecracker-toxic.js",
	"floatingmiststance-agile.js",
	"floatingmiststance-base.js",
	"floatingmiststance-soothing.js",
	"goadfutility-base.js",
	"herbbasket-base.js",
	"herbbasket-organic.js",
	"herbbasket-reinforced.js",
	"herbbasket-urgent.js",
	"icebolt-awesome.js",
	"icebolt-base.js",
	"icebolt-distracting.js",
	"infiniteregeneration-base.js",
	"infiniteregeneration-discounted.js",
	"infiniteregeneration-fatesealing.js",
	"inspiration-base.js",
	"inspiration-guarding.js",
	"inspiration-soothing.js",
	"inspiration-sweeping.js",
	"ironfiststance-base.js",
	"ironfiststance-organic.js",
	"lance-accelerating.js",
	"lance-base.js",
	"lance-shattering.js",
	"lance-unstoppable.js",
	"lifedrain-base.js",
	"lifedrain-flanking.js",
	"lifedrain-furious.js",
	"lifedrain-thirsting.js",
	"medicine-base.js",
	"medicine-bouncing.js",
	"medicine-cleansing.js",
	"medicine-soothing.js",
	"midasstaff-accelerating.js",
	"midasstaff-base.js",
	"midasstaff-discounted.js",
	"midasstaff-soothing.js",
	"morningstar-base.js",
	"morningstar-awesome.js",
	"morningstar-bashing.js",
	"morningstar-hunters.js",
	"pistol-base.js",
	"pistol-double.js",
	"pistol-duelists.js",
	"pistol-flanking.js",
	"poisontorrent-base.js",
	"poisontorrent-distracting.js",
	"poisontorrent-harmful.js",
	"powerfromwrath-base.js",
	"prismaticblast-base.js",
	"prismaticblast-vexing.js",
	"refreshingbreeze-base.js",
	"riskymixture-base.js",
	"riskymixture-long.js",
	"sabotagekit-base.js",
	"sabotagekit-long.js",
	"sabotagekit-shattering.js",
	"sabotagekit-urgent.js",
	"scarf-base.js",
	"scarf-hearty.js",
	"scutum-base.js",
	"scutum-guarding.js",
	"scutum-lucky.js",
	"scutum-sweeping.js",
	"scythe-base.js",
	"scythe-lethal.js",
	"scythe-toxic.js",
	"scythe-unstoppable.js",
	"secondwind-base.js",
	"secondwind-cleansing.js",
	"secondwind-lucky.js",
	"secondwind-soothing.js",
	"shortsword-accelerating.js",
	"shortsword-base.js",
	"shortsword-lethal.js",
	"shortsword-toxic.js",
	"shoulderthrow-base.js",
	"shoulderthrow-evasive.js",
	"spear-base.js",
	"spear-lethal.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"strongattack-base.js",
	"strongattack-flanking.js",
	"strongattack-sharpened.js",
	"strongattack-staggering.js",
	"warcry-base.js",
	"warcry-charging.js",
	"warcry-slowing.js",
	"warcry-tormenting.js",
	"warhammer-base.js",
	"warhammer-reactive.js",
	"warhammer-slowing.js",
	"warhammer-unstoppable.js",
	"wolfring-base.js",
	"wolfring-surpassing.js",
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
 * @param {number | "max"} durability
 */
function buildGearRecord(gearName, durability) {
	const template = GEAR[gearName.toLowerCase()];
	return new Gear(gearName, durability === "max" ? template.maxDurability : durability, template.maxHP, template.power, template.speed, template.critRate, template.poise);
}

/**
 * @param {string} gearName
 * @param {boolean} buildFullDescription
 * @param {Delver?} holder
 */
function buildGearDescription(gearName, buildFullDescription, holder) {
	if (gearExists(gearName)) {
		/** @type {string} */
		let description;
		if (buildFullDescription) {
			// return the base and crit effects of the gear with the base italicized
			description = `*Effect:* ${getGearProperty(gearName, "description")}\n*Critical💥:* ${getGearProperty(gearName, "critDescription")}`;
		} else {
			// return the base effect of the gear unitalicized
			description = getGearProperty(gearName, "description");
		}

		let damage = getGearProperty(gearName, "damage");
		const stagger = getGearProperty(gearName, "stagger");
		const element = getGearProperty(gearName, "element");
		if (holder) {
			damage += holder.power + holder.getModifierStacks("Power Up");
			damage = Math.floor(Math.min(damage, holder.getDamageCap()));

			if (holder.element === element) {
				description = description
					.replace(/@{foeStagger}/g, `${stagger + 2} Stagger`)
					.replace(/@{allyStagger}/g, `${stagger + 1} Stagger`);
			} else {
				description = description
					.replace(/@{foeStagger}/g, `${stagger} Stagger`)
					.replace(/@{allyStagger}/g, `${stagger} Stagger`);
			}
		} else {
			damage = `(${damage} base)`;
			description = description
				.replace(/@{foeStagger}/g, `(${stagger} base) Stagger`)
				.replace(/@{allyStagger}/g, `(${stagger} base) Stagger`);
		}

		description = description.replace(/@{element}/g, getEmoji(element))
			.replace(/@{critMultiplier}/g, getGearProperty(gearName, "critMultiplier"))
			.replace(/@{damage}/g, damage)
			.replace(/@{bonus}/g, getGearProperty(gearName, "bonus"))
			.replace(/@{protection}/g, getGearProperty(gearName, "protection"))
			.replace(/@{hpCost}/g, getGearProperty(gearName, "hpCost"))
			.replace(/@{healing}/g, getGearProperty(gearName, "healing"))
			.replace(/@{maxHP}/g, getGearProperty(gearName, "maxHP"))
			.replace(/@{speed}/g, getGearProperty(gearName, "speed"))
			.replace(/@{critRate}/g, getGearProperty(gearName, "critRate"))
			.replace(/@{poise}/g, getGearProperty(gearName, "poise"))
			.replace(/@{extraStagger}/g, `${stagger} Stagger`);
		getGearProperty(gearName, "modifiers")?.forEach((modifier, index) => {
			if (!modifier.name.startsWith("unparsed")) {
				const modifierEmoji = getModifierEmoji(modifier.name);
				description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifierEmoji);
			}
			description = description.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		})
		return description;
	} else {
		return "";
	}
}

module.exports = {
	gearNames: GEAR_NAMES,
	gearExists,
	getGearProperty,
	buildGearRecord,
	buildGearDescription
};
