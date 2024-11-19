const { BuildError, GearTemplate, Gear, Delver, Adventure } = require("../classes");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");
const { getEmoji } = require("../util/elementUtil");

/** @type {Record<string, GearTemplate>} */
const GEAR = {};
const GEAR_NAMES = [];

for (const file of [
	"_appease.js",
	"_greed.js",
	"_punch-base.js",
	"_punch-floatingmist.js",
	"_punch-ironfist.js",
	"abacus-base.js",
	"abacus-sharpened.js",
	"abacus-thiefs.js",
	"abacus-unstoppable.js",
	"airblades-accelerating.js",
	"airblades-base.js",
	"airblades-toxic.js",
	"airblades-unstoppable.js",
	"barrier-base.js",
	"barrier-cleansing.js",
	"barrier-devoted.js",
	"barrier-vigilant.js",
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
	"buckler-accelerating.js",
	"buckler-base.js",
	"buckler-devoted.js",
	"buckler-guarding.js",
	"carrot-base.js",
	"carrot-devoted.js",
	"carrot-lucky.js",
	"carrot-reinforced.js",
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
	"chainmail-poised.js",
	"chainmail-powerful.js",
	"chainmail-wise.js",
	"cloak-accelerating.js",
	"cloak-accurate.js",
	"cloak-base.js",
	"cloak-evasive.js",
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
	"floatingmiststance-devoted.js",
	"floatingmiststance-soothing.js",
	"goadfutility-base.js",
	"goadfutility-flanking.js",
	"goadfutility-poised.js",
	"goadfutility-shattering.js",
	"heatmirage-base.js",
	"heatmirage-evasive.js",
	"heatmirage-unlucky.js",
	"heatmirage-vigilant.js",
	"herbbasket-base.js",
	"herbbasket-organic.js",
	"herbbasket-reinforced.js",
	"herbbasket-urgent.js",
	"icebolt-awesome.js",
	"icebolt-base.js",
	"icebolt-distracting.js",
	"icebolt-unlucky.js",
	"infiniteregeneration-base.js",
	"infiniteregeneration-discounted.js",
	"infiniteregeneration-fatesealing.js",
	"infiniteregeneration-purifying.js",
	"inspiration-base.js",
	"inspiration-guarding.js",
	"inspiration-soothing.js",
	"inspiration-sweeping.js",
	"ironfiststance-accurate.js",
	"ironfiststance-base.js",
	"ironfiststance-lucky.js",
	"ironfiststance-organic.js",
	"lance-base.js",
	"lance-duelists.js",
	"lance-shattering.js",
	"lance-surpassing.js",
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
	"omamori-base.js",
	"omamori-centering.js",
	"omamori-cleansing.js",
	"omamori-devoted.js",
	"pistol-base.js",
	"pistol-double.js",
	"pistol-duelists.js",
	"pistol-flanking.js",
	"poisontorrent-base.js",
	"poisontorrent-distracting.js",
	"poisontorrent-harmful.js",
	"poisontorrent-staggering.js",
	"powerfromwrath-base.js",
	"powerfromwrath-bashing.js",
	"powerfromwrath-hunters.js",
	"powerfromwrath-staggering.js",
	"prismaticblast-base.js",
	"prismaticblast-distracting.js",
	"prismaticblast-flanking.js",
	"prismaticblast-vexing.js",
	"refreshingbreeze-accelerating.js",
	"refreshingbreeze-base.js",
	"refreshingbreeze-supportive.js",
	"refreshingbreeze-swift.js",
	"riskymixture-base.js",
	"riskymixture-midass.js",
	"riskymixture-potent.js",
	"riskymixture-thick.js",
	"sabotagekit-base.js",
	"sabotagekit-potent.js",
	"sabotagekit-shattering.js",
	"sabotagekit-urgent.js",
	"scarf-accurate.js",
	"scarf-base.js",
	"scarf-hearty.js",
	"scarf-wise.js",
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
	"shoulderthrow-harmful.js",
	"shoulderthrow-staggering.js",
	"spear-base.js",
	"spear-lethal.js",
	"spear-reactive.js",
	"spear-sweeping.js",
	"stick-base.js",
	"stick-sharpened.js",
	"stick-shattering.js",
	"stick-staggering.js",
	"strongattack-base.js",
	"strongattack-flanking.js",
	"strongattack-sharpened.js",
	"strongattack-staggering.js",
	"universalsolution-base.js",
	"universalsolution-centering.js",
	"universalsolution-evasive.js",
	"universalsolution-harmful.js",
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
	"wolfring-swift.js",
	"wolfring-wise.js"
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
	let durability = template.maxDurability;
	const shoddyPenalty = adventure.getChallengeIntensity("Shoddy Craftsmanship");
	if (shoddyPenalty) {
		durability = Math.ceil(durability * (100 - shoddyPenalty) / 100);
	}
	return new Gear(gearName, durability, template.maxHP, template.power, template.speed, template.critRate, template.poise);
}

/**
 * @param {string} gearName
 * @param {boolean} buildFullDescription
 * @param {Delver?} holder
 */
function buildGearDescription(gearName, buildFullDescription, holder) {
	if (!gearExists(gearName)) {
		return "";
	}
	let totalStagger = getGearProperty(gearName, "stagger") ?? 0;
	if (holder) {
		if (gearName === "Floating Mist Punch") {
			totalStagger += 3 * holder.getModifierStacks("Floating Mist Stance");
		}
		if (getGearProperty(gearName, "element") === holder.element || gearName === "Iron Fist Punch") {
			switch (getGearProperty(gearName, "targetingTags").team) {
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
	let text = "";
	if (buildFullDescription) {
		const descriptionTexts = getGearProperty(gearName, "descriptions").map(([type, description]) => {
			if (type === "use") {
				return `*${totalStagger} Stagger*: ${description}`;
			} else if (!["upgradeDiff"].includes(type)) {
				return `*${type}*: ${description}`;
			}
		});
		text = descriptionTexts.join("\n");
	} else {
		// these descriptions get used in select option sets, which don't support markdown
		const descriptionTexts = getGearProperty(gearName, "descriptions").map(([type, description]) => {
			if (type === "use") {
				return `${totalStagger} Stagger: ${description}`;
			} else if (!["Critical💥", "upgradeDiff"].includes(type)) {
				return `${type}: ${description}`;
			}
		});
		text = descriptionTexts.join(". ")
	}

	let damage = getGearProperty(gearName, "damage");
	if (damage !== undefined) {
		if (holder) {
			damage += holder.getPower();
			if (gearName === "Iron Fist Punch") {
				damage += 45 * holder.getModifierStacks("Iron Fist Stance");
			}
			text = text.replace(/@{damage}/g, `[${Math.floor(Math.min(damage, holder.getDamageCap()))}]`);
		} else {
			text = text.replace(/@{damage}/g, `(${damage} + power)`);
		}
	}

	if (holder) {
		text = text.replace(/@{bonusSpeed}/g, `[${Math.max(0, holder.getSpeed(true) - 100)}]`);
	} else {
		text = text.replace(/@{bonusSpeed}/g, "(speed over 100)");
	}

	return injectGearStats(text, gearName, gearName === "Iron Fist Punch" ? holder.element : null);
}

/**
 * @param {string} text
 * @param {string} gearName
 * @param {string | null} elementOverride
 */
function injectGearStats(text, gearName, elementOverride) {
	getGearProperty(gearName, "modifiers")?.forEach((modifier, index) => {
		if (!modifier.name.startsWith("unparsed")) {
			text = text.replace(new RegExp(`@{mod${index}}`, "g"), getApplicationEmojiMarkdown(modifier.name));
		}
		text = text.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
	})
	if (elementOverride) {
		text = text.replace(/@{element}/g, getEmoji(elementOverride))
	} else {
		text = text.replace(/@{element}/g, getEmoji(getGearProperty(gearName, "element")))
	}
	return text.replace(/@{critMultiplier}/g, getGearProperty(gearName, "critMultiplier"))
		.replace(/@{bonus}/g, getGearProperty(gearName, "bonus"))
		.replace(/@{bonus2}/g, getGearProperty(gearName, "bonus2"))
		.replace(/@{protection}/g, getGearProperty(gearName, "protection"))
		.replace(/@{hpCost}/g, getGearProperty(gearName, "hpCost"))
		.replace(/@{healing}/g, getGearProperty(gearName, "healing"))
		.replace(/@{maxHP}/g, getGearProperty(gearName, "maxHP"))
		.replace(/@{power}/g, getGearProperty(gearName, "power"))
		.replace(/@{speed}/g, getGearProperty(gearName, "speed"))
		.replace(/@{critRate}/g, getGearProperty(gearName, "critRate"))
		.replace(/@{poise}/g, getGearProperty(gearName, "poise"));
}

module.exports = {
	gearNames: GEAR_NAMES,
	gearExists,
	getGearProperty,
	buildGearRecord,
	buildGearDescription,
	injectGearStats
};
