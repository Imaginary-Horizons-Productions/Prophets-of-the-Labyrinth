const { BuildError, GearTemplate } = require("../classes");
const { getEmoji } = require("../util/elementUtil");

/** @type {Record<string, GearTemplate>} */
const GEAR = {};

for (const file of [
	"_punch.js",
	// "barrier-base.js",
	// "barrier-purifying.js",
	// "barrier-thick.js",
	// "barrier-urgent.js",
	// "battleaxe-base.js",
	// "battleaxe-prideful.js",
	// "battleaxe-thick.js",
	// "battleaxe-thirsting.js",
	"bloodaegis-base.js",
	"bloodaegis-charging.js",
	"bloodaegis-heavy.js",
	"bloodaegis-sweeping.js",
	// "bow-base.js",
	// "bow-evasive.js",
	// "bow-hunters.js",
	// "bow-mercurial.js",
	"buckler-base.js",
	"buckler-devoted.js",
	"buckler-guarding.js",
	"buckler-heavy.js",
	"censer-base.js",
	"censer-fatesealing.js",
	"censer-thick.js",
	"censer-tormenting.js",
	// "certainvictory-base.js",
	// "certainvictory-hunters.js",
	// "certainvictory-lethal.js",
	// "certainvictory-reckless.js",
	"cloak-base.js",
	"cloak-long.js",
	"cloak-accelerating.js",
	"cloak-thick.js",
	"corrosion-base.js",
	"corrosion-flanking.js",
	"daggers-base.js",
	"daggers-sharpened.js",
	"daggers-slowing.js",
	"daggers-sweeping.js",
	// "firecracker-base.js",
	// "firecracker-double.js",
	// "firecracker-mercurial.js",
	// "firecracker-toxic.js",
	"floatingmiststance-base.js",
	"floatingmiststance-soothing.js",
	// "infiniteregeneration-base.js",
	// "infiniteregeneration-fatesealing.js",
	// "inspiration-base.js",
	// "inspiration-reinforcing.js",
	// "inspiration-soothing.js",
	// "inspiration-sweeping.js",
	"ironfiststance-base.js",
	"ironfiststance-organic.js",
	"lance-accelerating.js",
	"lance-base.js",
	"lance-piercing.js",
	"lance-vigilant.js",
	"lifedrain-base.js",
	"lifedrain-flanking.js",
	"lifedrain-reactive.js",
	"lifedrain-urgent.js",
	// "midasstaff-base.js",
	// "midasstaff-soothing.js",
	// "midasstaff-accelerating.js",
	"potionkit-base.js",
	"potionkit-guarding.js",
	"potionkit-organic.js",
	"potionkit-urgent.js",
	"scutum-base.js",
	"scutum-heavy.js",
	"scutum-sweeping.js",
	"scutum-vigilant.js",
	// "scythe-base.js",
	// "scythe-lethal.js",
	// "scythe-piercing.js",
	// "scythe-toxic.js",
	"shortsword-accelerating.js",
	"shortsword-base.js",
	"shortsword-toxic.js",
	"sickle-base.js",
	"sickle-hunters.js",
	"sickle-sharpened.js",
	"sickle-toxic.js",
	// "spear-base.js",
	// "spear-lethal.js",
	// "spear-reactive.js",
	// "spear-sweeping.js",
	// "sunflare-base.js",
	// "sunflare-evasive.js",
	// "sunflare-accelerating.js",
	// "sunflare-tormenting.js",
	// "vigilancecharm-base.js",
	// "vigilancecharm-devoted.js",
	// "vigilancecharm-long.js",
	// "vigilancecharm-guarding.js",
	// "warcry-base.js",
	// "warcry-charging.js",
	// "warcry-slowing.js",
	// "warcry-tormenting.js",
	// "warhammer-base.js",
	// "warhammer-piercing.js",
	// "warhammer-slowing.js"
]) {
	const gear = require(`./${file}`);
	if (gear.name in GEAR) {
		throw new BuildError(`Duplicate gear name (${gear.name})`);
	}
	GEAR[gear.name] = gear;
};

/** Checks if a type of equipment with the given name exists
 * @param {string} gearName
 */
function gearExists(gearName) {
	return gearName in GEAR;
}

/** Lookup a static property for a type of equipment
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
		console.error(`Equipment name ${gearName} not recognized`);
	}
}

function buildGearDescription(gearName, buildFullDescription) {
	if (gearExists(gearName)) {
		let description;
		if (buildFullDescription) {
			// return the base and crit effects of the equipment with the base italicized
			description = `*Effect:* ${getGearProperty(gearName, "description")}\n*Critical💥:* ${exports.getGearProperty(gearName, "critDescription")}`;
		} else {
			// return the base effect of the equipment unitalicized
			description = getGearProperty(gearName, "description");
		}

		description = description.replace(/@{element}/g, getEmoji(getGearProperty(gearName, "element")))
			.replace(/@{critBonus}/g, getGearProperty(gearName, "critBonus"))
			.replace(/@{damage}/g, getGearProperty(gearName, "damage"))
			.replace(/@{bonus}/g, getGearProperty(gearName, "bonus"))
			.replace(/@{block}/g, getGearProperty(gearName, "block"))
			.replace(/@{hpCost}/g, getGearProperty(gearName, "hpCost"))
			.replace(/@{healing}/g, getGearProperty(gearName, "healing"));
		getGearProperty(gearName, "modifiers").forEach((modifier, index) => {
			description = description.replace(new RegExp(`@{mod${index}}`, "g"), modifier.name)
				.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		})
		return description;
	}
}

module.exports = {
	gearNames: Object.keys(GEAR),
	gearExists,
	getGearProperty,
	buildGearDescription
};
