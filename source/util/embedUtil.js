const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ThreadChannel, EmbedBuilder, ButtonStyle, Colors, EmbedFooterData, EmbedField, MessagePayload, Message } = require("discord.js");

const { Adventure, ArtifactTemplate, Delver } = require("../classes");
const { DISCORD_ICON_URL, POTL_ICON_URL, SAFE_DELIMITER, MAX_BUTTONS_PER_ROW, MAX_MESSAGE_ACTION_ROWS } = require("../constants");

const { getCompany, setCompany } = require("../orcustrators/companyOrcustrator");
const { getPlayer, setPlayer } = require("../orcustrators/playerOrcustrator");

const { getChallenge } = require("../challenges/_challengeDictionary");
const { getGearProperty, buildGearDescription } = require("../gear/_gearDictionary");
const { getLabyrinthProperty } = require("../labyrinths/_labyrinthDictionary");
const { getRoom } = require("../rooms/_roomDictionary");

const { getEmoji, getColor } = require("./elementUtil");
const { generateRoutingRow, generateLootRow } = require("./messageComponentUtil");
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

/** Derive the embeds and components that correspond with the adventure's state
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} descriptionOverride
 */
function renderRoom(adventure, thread, descriptionOverride) {
	const roomTemplate = getRoom(adventure.room.title);
	const hasEnemies = Object.keys(adventure.room.enemies).length > 0;
	const isCombatVictory = adventure.room.enemies?.every(enemy => enemy.hp === 0);

	const roomEmbed = new EmbedBuilder().setColor(getColor(adventure.room.element))
		.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(`${adventure.room.title}${isCombatVictory ? " - Victory!" : ""}`)
		.setFooter({ text: `Room #${adventure.depth}${hasEnemies ? ` - Round ${adventure.room.round}` : ""}` });

	if (descriptionOverride || roomTemplate) {
		roomEmbed.setDescription(descriptionOverride || roomTemplate.description.replace("@{roomElement}", adventure.room.element));
	}
	let components = [];

	if (adventure.depth <= getLabyrinthProperty(adventure.labyrinth, "maxDepth")) {
		if (!Adventure.endStates.includes(adventure.state)) {
			// Continue
			const roomActionCount = adventure.room.resources.roomAction?.count;
			if ("roomAction" in adventure.room.resources) {
				roomEmbed.addFields({ name: "Room Actions", value: roomActionCount.toString() });
			}

			if (roomTemplate?.buildUI) {
				components.push(...roomTemplate.buildUI(adventure));
			}

			components = components.slice(0, MAX_MESSAGE_ACTION_ROWS - 2);
			if (hasEnemies && !isCombatVictory) {
				components.push(new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("inspectself")
						.setLabel("Inspect Self")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder().setCustomId("predict")
						.setEmoji("🔮")
						.setLabel("Predict")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder().setCustomId("readymove")
						.setLabel("Ready a Move")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("readyitem")
						.setLabel("Ready an Item")
						.setStyle(ButtonStyle.Primary)
						.setDisabled(!Object.values(adventure.items).some(quantity => quantity > 0))
				));
			} else {
				if (isCombatVictory) {
					components.push(generateLootRow(adventure));
				}
				roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." });
				components.push(generateRoutingRow(adventure));
			}
		} else {
			// Defeat
			addScoreField(roomEmbed, adventure, thread.guildId);
			components = [];

		}
	} else {
		// Victory
		addScoreField(roomEmbed, adventure, thread.guildId);
		components = [new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId("viewcollectartifact")
				.setLabel("Collect Artifact")
				.setStyle(ButtonStyle.Success)
		)];
	}
	return {
		embeds: [roomEmbed],
		components
	}
}

/** The score breakdown is added to a room embed to show how the players in the just finished adventure did
 * @param {MessageEmbed} embed
 * @param {Adventure} adventure
 * @param {string} guildId
 */
function addScoreField(embed, adventure, guildId) {
	const livesScore = adventure.lives * 10;
	const goldScore = Math.floor(Math.log10(adventure.peakGold)) * 5;
	let score = adventure.accumulatedScore + livesScore + goldScore + adventure.depth;
	let challengeMultiplier = 1;
	Object.keys(adventure.challenges).forEach(challengeName => {
		const challenge = getChallenge(challengeName);
		challengeMultiplier *= challenge.scoreMultiplier;
	})
	score *= challengeMultiplier;
	const skippedArtifactsMultiplier = 1 + (adventure.delvers.reduce((count, delver) => delver.startingArtifact ? count : count + 1, 0) / adventure.delvers.length);
	score = Math.max(1, score * skippedArtifactsMultiplier);
	switch (adventure.state) {
		case "success":
			embed.setTitle(`Success in ${adventure.labyrinth}`);
			break;
		case "defeat":
			embed.setTitle(`Defeated${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
			score = Math.floor(score / 2);
			break;
		case "giveup":
			embed.setTitle(`Gave up${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
			score = 0;
			break;
	}
	const depthScoreLine = generateScoreline("additive", "Depth", adventure.depth);
	const livesScoreLine = generateScoreline("additive", "Lives", livesScore);
	const goldScoreline = generateScoreline("additive", "Gold", goldScore);
	const bonusScoreline = generateScoreline("additive", "Bonus", adventure.accumulatedScore);
	const challengesScoreline = generateScoreline("multiplicative", "Challenges Multiplier", challengeMultiplier);
	const skippedArtifactScoreline = generateScoreline("multiplicative", "Artifact Skip Multiplier", skippedArtifactsMultiplier);
	const defeatScoreline = generateScoreline("multiplicative", "Defeat", adventure.state === "defeat" ? 0.5 : 1);
	const giveupScoreline = generateScoreline("multiplicative", "Give Up", adventure.state === "giveup" ? 0 : 1);
	embed.addFields({ name: "Score Breakdown", value: `${depthScoreLine}${livesScoreLine}${goldScoreline}${bonusScoreline}${challengesScoreline}${skippedArtifactScoreline}${defeatScoreline}${giveupScoreline}\n__Total__: ${score}` });
	adventure.accumulatedScore = score;

	const company = getCompany(guildId);
	if (adventure.accumulatedScore > company.highScore.score) {
		company.highScore = {
			score: adventure.accumulatedScore,
			playerIds: adventure.delvers.map(delver => delver.id),
			adventure: adventure.name
		};
		setCompany(company);
	}
	adventure.delvers.forEach(delver => {
		if (adventure.state !== "giveup") {
			const player = getPlayer(delver.id, guildId);
			if (player.scores[guildId]) {
				player.scores[guildId].total += adventure.accumulatedScore;
				if (adventure.accumulatedScore > player.scores[guildId].high) {
					player.scores[guildId].high = adventure.accumulatedScore;
				}
			} else {
				player.scores[guildId] = { total: adventure.accumulatedScore, high: adventure.accumulatedScore };
			}
			if (adventure.accumulatedScore > player.archetypes[delver.archetype]) {
				player.archetypes[delver.archetype] = adventure.accumulatedScore;
			}
			setPlayer(player);
		}
		company.adventuring.delete(delver.id);
	})
}

/** Generates the string for a scoreline or omits the line (returns empty string) if value is the identity for stackType
 * @param {"additive" | "multiplicative"} stackType
 * @param {string} label
 * @param {number} value
 */
function generateScoreline(stackType, label, value) {
	switch (stackType) {
		case "additive":
			if (value !== 0) {
				return `${label}: ${value.toString()}\n`;
			}
			break;
		case "multiplicative":
			if (value !== 1) {
				return `${label}: x${value.toString()}\n`;
			}
			break;
		default:
			console.error(new Error(`Generating scoreline with unregistered stackType: ${stackType}`));
	}
	return "";
}

/** A room embed's author field contains the most important or commonly viewed party resources and stats
 * @param {Adventure} adventure
 * @returns {string} text to put in the author name field of a room embed
 */
function roomHeaderString({ lives, gold, accumulatedScore }) {
	return `Lives: ${lives} - Party Gold: ${gold} - Score: ${accumulatedScore}`;
}

/** The room header goes in the embed's author field and should contain information about the party's commonly used or important resources
 * @param {Adventure} adventure
 * @param {Message} message
 */
function updateRoomHeader(adventure, message) {
	message.edit({ embeds: message.embeds.map(embed => new EmbedBuilder(embed).setAuthor({ name: roomHeaderString(adventure), iconURL: message.client.user.displayAvatarURL() })) })
}

/** The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project
 * @param {string} avatarURL
 * @returns {EmbedBuilder}
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

/** Seen in target selection embeds and /inspect-self gear fields contain nearly all information about the gear they represent
 * @param {string} gearName
 * @param {number} durability
 * @returns {EmbedField} contents for a message embed field
 */
function gearToEmbedField(gearName, durability) {
	/** @type {number} */
	const maxDurability = getGearProperty(gearName, "maxDurability");
	const durabilityText = durability === Infinity ? "∞ uses" : `${generateTextBar(durability, maxDurability, maxDurability)} ${durability}/${maxDurability} durability`;
	return {
		name: `${gearName} ${getEmoji(getGearProperty(gearName, "element"))} (${durabilityText})`,
		value: buildGearDescription(gearName, true)
	};
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} gearCapacity
 * @returns {MessagePayload}
 */
function inspectSelfPayload(delver, gearCapacity) {
	const embed = new EmbedBuilder().setColor(getColor(delver.element))
		.setTitle(`${delver.getName()} the ${delver.archetype}`)
		.setDescription(`HP: ${generateTextBar(delver.hp, delver.maxHP, 11)} ${delver.hp}/${delver.maxHP}\nYour ${getEmoji(delver.element)} moves add 1 Stagger to enemies and remove 1 Stagger from allies.`)
		.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" });
	if (delver.block > 0) {
		embed.addFields({ name: "Block", value: delver.block.toString() })
	}
	for (let index = 0; index < gearCapacity; index++) {
		if (delver.gear[index]) {
			embed.addFields(gearToEmbedField(delver.gear[index].name, delver.gear[index].durability));
		} else {
			embed.addFields({ name: `${ordinalSuffixEN(index + 1)} Gear Slot`, value: "No gear yet..." })
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
	renderRoom,
	updateRoomHeader,
	generateVersionEmbed,
	generateArtifactEmbed,
	gearToEmbedField,
	inspectSelfPayload
};
