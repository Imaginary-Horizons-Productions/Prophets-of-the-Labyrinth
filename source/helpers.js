const { EmbedBuilder, Colors } = require("discord.js");
const fs = require("fs");

const discordIconURL = "https://cdn.discordapp.com/attachments/618523876187570187/1110265047516721333/discord-mark-blue.png";
/** @type {import("discord.js").EmbedFooterData[]} */
const discordTips = [
	{ text: "Message starting with @silent don't send notifications; good for when everyone's asleep.", iconURL: discordIconURL },
	{ text: "Surround your message with || to mark it a spoiler (not shown until reader clicks on it).", iconURL: discordIconURL },
	{ text: "Surround a part of your messag with ~~ to add strikethrough styling.", iconURL: discordIconURL },
	{ text: "Don't forget to check slash commands for optional arguments.", iconURL: discordIconURL },
	{ text: "Some slash commands can be used in DMs, others can't.", iconURL: discordIconURL },
	{ text: "Server subscriptions cost more on mobile because the mobile app stores take a cut.", iconURL: discordIconURL }
];
/** @type {import("discord.js").EmbedFooterData[]} */
const applicationSpecificTips = [];
const tipPool = applicationSpecificTips.concat(applicationSpecificTips, discordTips);

/** twice as likely to roll an application specific tip as a discord tip */
exports.randomFooterTip = function () {
	return tipPool[Math.floor(Math.random() * tipPool.length)];
}

/** The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project
 * @param {string} avatarURL
 * @returns {MessageEmbed}
 */
exports.getVersionEmbed = async function (avatarURL) {
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

/** @param {string?} tag */
exports.generateRuntimeTemplateStringRegExp = (tag) => new RegExp(`@{(${tag ?? "[a-zA-Z]+"})}`, "g");
