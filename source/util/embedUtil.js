const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageCreateOptions, EmbedFooterData, EmbedField, MessagePayload } = require("discord.js");
const fs = require("fs");
const { Adventure, ArtifactTemplate } = require("../classes");
const { DISCORD_ICON_URL, POTL_ICON_URL, SAFE_DELIMITER, MAX_BUTTONS_PER_ROW } = require("../constants");
const { getEmoji, getColor } = require("./elementUtil");
const { getGearProperty, buildGearDescription } = require("../gear/_gearDictionary");
const { ordinalSuffixEN, generateTextBar } = require("./textUtil");

/** @type {EmbedFooterData[]} */
const discordTips = [
	{ text: "Message starting with @silent don't send notifications; good for when everyone's asleep.", iconURL: DISCORD_ICON_URL },
	{ text: "Surround your message with || to mark it a spoiler (not shown until reader clicks on it).", iconURL: DISCORD_ICON_URL },
	{ text: "Surround a part of your messag with ~~ to add strikethrough styling.", iconURL: DISCORD_ICON_URL },
	{ text: "Don't forget to check slash commands for optional arguments.", iconURL: DISCORD_ICON_URL },
	{ text: "Some slash commands can be used in DMs, others can't.", iconURL: DISCORD_ICON_URL },
	{ text: "Server subscriptions cost more on mobile because the mobile app stores take a cut.", iconURL: DISCORD_ICON_URL }
];
/** @type {EmbedFooterData[]} */
const applicationSpecificTips = [];
const tipPool = applicationSpecificTips.concat(applicationSpecificTips, discordTips);

/** twice as likely to roll an application specific tip as a discord tip */
function randomFooterTip() {
	return tipPool[Math.floor(Math.random() * tipPool.length)];
}

/** Create a message embed with common settings */
function embedTemplate() {
	return new EmbedBuilder().setColor(Colors.Blurple)
		.setAuthor({ name: "Click here to vist the PotL GitHub", iconURL: POTL_ICON_URL, url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
		.setURL("https://discord.com/api/oauth2/authorize?client_id=950469509628702740&permissions=397284665360&scope=applications.commands%20bot")
		.setFooter({ text: "Click the title link to add PotL to your server", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
}

/** The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project
 * @param {string} avatarURL
 * @returns {MessageEmbed}
 */
async function generateVersionEmbed(avatarURL) {
	const data = await fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' });
	const dividerRegEx = /## .+ Version/g;
	const changesStartRegEx = /\.\d+:/g;
	const knownIssuesStartRegEx = /### Known Issues/g;
	let titleStart = dividerRegEx.exec(data).index;
	changesStartRegEx.exec(data);
	let knownIssuesStart;
	let knownIssueStartResult = knownIssuesStartRegEx.exec(data);
	if (knownIssueStartResult) {
		knownIssuesStart = knownIssueStartResult.index;
	}
	let knownIssuesEnd = dividerRegEx.exec(data).index;

	const embed = new EmbedBuilder().setColor(Colors.Blurple)
		.setAuthor({ name: "Click here to check out the Imaginary Horizons GitHub", iconURL: avatarURL, url: "https://github.com/Imaginary-Horizons-Productions" })
		.setTitle(data.slice(titleStart + 3, changesStartRegEx.lastIndex))
		.setURL('https://discord.gg/JxqE9EpKt9')
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png')
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
		.setTimestamp();

	if (knownIssuesStart && knownIssuesStart < knownIssuesEnd) {
		// Known Issues section found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart))
			.addFields({ name: "Known Issues", value: data.slice(knownIssuesStart + 16, knownIssuesEnd) });
	} else {
		// Known Issues section not found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
	}
	return embed.addFields({ name: "Become a Sponsor", value: "Chip in for server costs or get premium features by sponsoring [{bot} on GitHub]( url goes here )" });
}

/**
 * @param {ArtifactTemplate} artifactTemplate
 * @param {number} count
 * @param {Adventure?} adventure
 */
function generateArtifactEmbed(artifactTemplate, count, adventure) {
	const embed = embedTemplate()
		.setTitle(`${getEmoji(artifactTemplate.element)} ${artifactTemplate.name} x ${count}`)
		.setDescription(artifactTemplate.dynamicDescription(count))
		.addFields({ name: "Scaling", value: artifactTemplate.scalingDescription });
	if (artifactTemplate.flavorText) {
		embed.addFields(artifactTemplate.flavorText);
	}
	if (adventure) {
		const artifactCopy = Object.assign({}, adventure.artifacts[artifactTemplate.name]);
		delete artifactCopy["count"];
		Object.entries(artifactCopy).forEach(([statistic, value]) => {
			embed.addFields({ name: statistic, value: value.toString() });
		})
	}
	return embed;
}

/** Seen in target selection embeds and /inspect-self equipment fields contain nearly all information about the equipment they represent
 * @param {string} gearName
 * @param {number} uses
 * @returns {EmbedField} contents for a message embed field
 */
function gearToEmbedField(gearName, uses) {
	const maxUses = getGearProperty(gearName, "maxUses");
	const usesText = uses === Infinity ? "∞ uses" : `${generateTextBar(uses, maxUses, maxUses)} ${uses}/${maxUses} uses`;
	return {
		name: `${gearName} ${getEmoji(getGearProperty(gearName, "element"))} (${usesText})`,
		value: buildGearDescription(gearName, true)
	};
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} equipmentCapacity
 * @returns {MessagePayload}
 */
function inspectSelfPayload(delver, equipmentCapacity) {
	const embed = new EmbedBuilder().setColor(getColor(delver.element))
		.setTitle(`${delver.getName()} the ${delver.archetype}`)
		.setDescription(`HP: ${generateTextBar(delver.hp, delver.maxHp, 11)} ${delver.hp}/${delver.maxHp}\nYour ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (delver.block > 0) {
		embed.addFields({ name: "Block", value: delver.block.toString() })
	}
	for (let index = 0; index < equipmentCapacity; index++) {
		if (delver.equipment[index]) {
			embed.addFields(gearToEmbedField(delver.equipment[index].name, delver.equipment[index].uses));
		} else {
			embed.addFields({ name: `${ordinalSuffixEN(index + 1)} Equipment Slot`, value: "No equipment yet..." })
		}
	}
	const components = [];
	if (Object.keys(delver.modifiers).length) {
		const actionRow = [];
		const modifiers = Object.keys(delver.modifiers);
		let buttonCount = Math.min(modifiers.length, MAX_BUTTONS_PER_ROW - 1); // save spot for "and X more..." button
		for (let i = 0; i < buttonCount; i++) {
			const modifierName = modifiers[i];
			let style;
			if (isBuff(modifierName)) {
				style = ButtonStyle.Primary;
			} else if (isDebuff(modifierName)) {
				style = ButtonStyle.Danger;
			} else {
				style = ButtonStyle.Secondary;
			}
			actionRow.push(new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}${modifierName}${SAFE_DELIMITER}${i}`)
				.setLabel(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
				.setStyle(style))
		}
		if (modifiers.length > 4) {
			actionRow.push(new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}MORE`)
				.setLabel(`${modifiers.length - 4} more...`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(!["Chemist", "Ritualist"].includes(delver.archetype)))
		}
		components.push(new ActionRowBuilder().addComponents(...actionRow));
	}
	return { embeds: [embed], components, ephemeral: true };
}


module.exports = {
	randomFooterTip,
	embedTemplate,
	generateVersionEmbed,
	generateArtifactEmbed,
	gearToEmbedField,
	inspectSelfPayload
};
