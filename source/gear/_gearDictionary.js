const { BuildError, GearTemplate, Gear, Delver } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

/** @type {Record<string, GearTemplate>} */
const GEAR = {};

for (const file of [
	"_appease.js",
	"_punch.js",
	"abacus-base.js",
	"abacus-hunters.js",
	"abacus-sharpened.js",
	"abacus-toxic.js",
	"barrier-base.js",
	"barrier-cleansing.js",
	"barrier-devoted.js",
	"barrier-long.js",
	"battleaxe-base.js",
	"battleaxe-prideful.js",
	"battleaxe-thick.js",
	"battleaxe-thirsting.js",
	"bloodaegis-base.js",
	"bloodaegis-charging.js",
	"bloodaegis-reinforced.js",
	"bloodaegis-sweeping.js",
	"bow-base.js",
	"bow-evasive.js",
	"bow-hunters.js",
	"bow-mercurial.js",
	"buckler-base.js",
	"buckler-devoted.js",
	"buckler-guarding.js",
	"buckler-reinforced.js",
	"cauldronstir-base.js",
	"censer-base.js",
	"censer-fatesealing.js",
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
	"corrosion-flanking.js",
	"corrosion-harmful.js",
	"corrosion-shattering.js",
	"daggers-base.js",
	"daggers-sharpened.js",
	"daggers-slowing.js",
	"daggers-sweeping.js",
	"firecracker-base.js",
	"firecracker-double.js",
	"firecracker-mercurial.js",
	"firecracker-toxic.js",
	"floatingmiststance-base.js",
	"floatingmiststance-soothing.js",
	"herbbasket-base.js",
	"herbbasket-organic.js",
	"herbbasket-reinforced.js",
	"herbbasket-urgent.js",
	"icebolt-base.js",
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
	"lance-unstoppable.js",
	"lance-vigilant.js",
	"lifedrain-base.js",
	"lifedrain-flanking.js",
	"lifedrain-reactive.js",
	"lifedrain-urgent.js",
	"medicine-base.js",
	"midasstaff-accelerating.js",
	"midasstaff-base.js",
	"midasstaff-discounted.js",
	"midasstaff-soothing.js",
	"morningstar-base.js",
	"pistol-base.js",
	"pistol-double.js",
	"pistol-duelists.js",
	"poisontorrent-base.js",
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
	"scarf-base.js",
	"scarf-hearty.js",
	"scutum-base.js",
	"scutum-guarding.js",
	"scutum-sweeping.js",
	"scutum-vigilant.js",
	"scythe-base.js",
	"scythe-lethal.js",
	"scythe-toxic.js",
	"scythe-unstoppable.js",
	"secondwind-base.js",
	"secondwind-cleansing.js",
	"secondwind-soothing.js",
	"shortsword-accelerating.js",
	"shortsword-base.js",
	"shortsword-toxic.js",
	"spear-base.js",
	"spear-lethal.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"strongattack-base.js",
	"strongattack-sharpened.js",
	"strongattack-staggering.js",
	"sunflare-accelerating.js",
	"sunflare-base.js",
	"sunflare-evasive.js",
	"sunflare-tormenting.js",
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
	if (gear.name in GEAR) {
		throw new BuildError(`Duplicate gear name (${gear.name})`);
	}
	GEAR[gear.name] = gear;
};

/** Checks if a type of gear with the given name exists
 * @param {string} gearName
 */
function gearExists(gearName) {
	return gearName in GEAR;
}

/** Lookup a static property for a type of gear
 * @param {string} gearName
 * @param {string} propertyName
 * @returns {unknown}
 */
function getGearProperty(gearName, propertyName) {
	if (gearExists(gearName)) {
		const template = GEAR[gearName];
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
	const template = GEAR[gearName];
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
			damage = Math.min(damage, holder.getDamageCap());

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
			description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifier.name)
				.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		})
		return description;
	} else {
		return "";
	}
}

module.exports = {
	gearNames: Object.keys(GEAR),
	gearExists,
	getGearProperty,
	buildGearRecord,
	buildGearDescription
};
