const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ThreadChannel, EmbedBuilder, ButtonStyle, Colors, EmbedAuthorData, EmbedFooterData, EmbedField, MessagePayload, Message } = require("discord.js");

const { Adventure, ArtifactTemplate, Delver } = require("../classes");
const { DISCORD_ICON_URL, POTL_ICON_URL, SAFE_DELIMITER, MAX_BUTTONS_PER_ROW, MAX_MESSAGE_ACTION_ROWS } = require("../constants");

const { getCompany, setCompany } = require("../orcustrators/companyOrcustrator");
const { getPlayer, setPlayer } = require("../orcustrators/playerOrcustrator");

const { getChallenge } = require("../challenges/_challengeDictionary");
const { getGearProperty, buildGearDescription } = require("../gear/_gearDictionary");
const { isBuff, isDebuff, isNonStacking } = require("../modifiers/_modifierDictionary");
const { getRoom } = require("../rooms/_roomDictionary");

const { getEmoji, getColor } = require("./elementUtil");
const { generateRoutingRow, generateLootRow } = require("./messageComponentUtil");
const { ordinalSuffixEN, generateTextBar } = require("./textUtil");

const discordTips = [
	"Message starting with @silent don't send notifications; good for when everyone's asleep.",
	"Don't forget to check slash commands for optional arguments.",
	"Some slash commands can be used in DMs, others can't.",
	"Server subscriptions cost more on mobile because the mobile app stores take a cut.",
];
const potlTips = [
	"Combatants lose their next turn (Stun) when their Stagger reaches their Poise.",
	"Using items has priority.",
	"Gear that matches your element removes 1 Stagger on allies.",
	"Gear that matches your element adds 2 Stagger on foes.",
	"Combatant speed varies every round.",
	"Damage is capped to 500 in one attack without any Power Up."
];
/** @type {EmbedAuthorData} */
const authorTipPool = potlTips.map(text => ({ name: text, iconURL: POTL_ICON_URL })).concat(potlTips.map(text => ({ name: text, iconURL: POTL_ICON_URL })), discordTips.map(text => ({ name: text, iconURL: DISCORD_ICON_URL })));
/** @type {EmbedFooterData[]} */
const footerTipPool = potlTips.map(text => ({ text, iconURL: POTL_ICON_URL })).concat(potlTips.map(text => ({ text, iconURL: POTL_ICON_URL })), discordTips.map(text => ({ text, iconURL: DISCORD_ICON_URL })));

/** twice as likely to roll an application specific tip as a discord tip */
function randomAuthorTip() {
	return authorTipPool[Math.floor(Math.random() * authorTipPool.length)];
}

/** twice as likely to roll an application specific tip as a discord tip */
function randomFooterTip() {
	return footerTipPool[Math.floor(Math.random() * footerTipPool.length)];
}

/** Create a message embed with Blurple color, IHP as author, and a random footer tip */
function embedTemplate() {
	return new EmbedBuilder().setColor(Colors.Blurple)
		.setAuthor({
			name: "Imaginary Horizons Productions",
			iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
			url: "https://github.com/Imaginary-Horizons-Productions"
		})
		.setFooter(randomFooterTip())
}

/** Derive the embeds and components that correspond with the adventure's state
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} descriptionOverride
 */
function renderRoom(adventure, thread, descriptionOverride) {
	const roomTemplate = getRoom(adventure.room.title);
	const hasEnemies = adventure.room.enemies;
	const isCombatVictory = adventure.room.enemies?.every(enemy => enemy.hp === 0);

	const roomEmbed = new EmbedBuilder().setColor(getColor(adventure.room.element))
		.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(`${adventure.room.title}${isCombatVictory ? " - Victory!" : ""}`)
		.setFooter({ text: `Room #${adventure.depth}${hasEnemies ? ` - Round ${adventure.room.round}` : ""}` });

	if (descriptionOverride || roomTemplate) {
		roomEmbed.setDescription(descriptionOverride || roomTemplate.description.replace("@{roomElement}", adventure.room.element));
	}
	let components = [];

	switch (adventure.state) {
		case "defeat":
		case "giveup":
			addScoreField(roomEmbed, adventure, thread.guildId);
			components = [];
			break;
		case "success":
			addScoreField(roomEmbed, adventure, thread.guildId);
			components = [new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId("viewcollectartifact")
					.setLabel("Collect Artifact")
					.setStyle(ButtonStyle.Success)
			)];
			break;
		default:
			if ("roomAction" in adventure.room.resources) {
				roomEmbed.addFields({ name: "Room Actions", value: adventure.room.resources.roomAction.count.toString() });
			}

			if (roomTemplate?.buildUI) {
				components.push(...roomTemplate.buildUI(adventure));
			}

			components = components.slice(0, MAX_MESSAGE_ACTION_ROWS - 2);
			if (hasEnemies && !isCombatVictory) {
				components.push(new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("inspectself")
						.setEmoji("🔎")
						.setLabel("Inspect Self")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder().setCustomId("predict")
						.setEmoji("🔮")
						.setLabel("Predict")
						.setStyle(ButtonStyle.Secondary),
					new ButtonBuilder().setCustomId("readymove")
						.setEmoji("⚔")
						.setLabel("Ready a Move")
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder().setCustomId("readyitem")
						.setEmoji("🧪")
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
			break;
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
	let { livesScore, goldScore, total: finalScore } = adventure.getBaseScore();
	let challengeMultiplier = 1;
	Object.keys(adventure.challenges).forEach(challengeName => {
		const challenge = getChallenge(challengeName);
		challengeMultiplier *= challenge.scoreMultiplier;
	})
	finalScore *= challengeMultiplier;
	const skippedArtifactsMultiplier = 1 + (adventure.delvers.reduce((count, delver) => delver.startingArtifact ? count : count + 1, 0) / adventure.delvers.length);
	finalScore = Math.max(1, finalScore * skippedArtifactsMultiplier);
	switch (adventure.state) {
		case "success":
			embed.setTitle(`Success in ${adventure.labyrinth}`);
			break;
		case "defeat":
			embed.setTitle(`Defeated${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
			finalScore = Math.floor(finalScore / 2);
			break;
		case "giveup":
			embed.setTitle(`Gave up${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
			finalScore = 0;
			break;
	}
	const depthScoreLine = generateScoreline("additive", "Depth", adventure.depth);
	const livesScoreLine = generateScoreline("additive", "Lives", livesScore);
	const goldScoreline = generateScoreline("additive", "Gold", goldScore);
	const bonusScoreline = generateScoreline("additive", "Bonus", adventure.score);
	const challengesScoreline = generateScoreline("multiplicative", "Challenges Multiplier", challengeMultiplier);
	const skippedArtifactScoreline = generateScoreline("multiplicative", "Artifact Skip Multiplier", skippedArtifactsMultiplier);
	const defeatScoreline = generateScoreline("multiplicative", "Defeat", adventure.state === "defeat" ? 0.5 : 1);
	const giveupScoreline = generateScoreline("multiplicative", "Give Up", adventure.state === "giveup" ? 0 : 1);
	embed.addFields({ name: "Score Breakdown", value: `${depthScoreLine}${livesScoreLine}${goldScoreline}${bonusScoreline}${challengesScoreline}${skippedArtifactScoreline}${defeatScoreline}${giveupScoreline}\n__Total__: ${finalScore}` });
	adventure.score = finalScore;

	const company = getCompany(guildId);
	if (finalScore > company.highScore.score) {
		company.highScore = {
			score: finalScore,
			playerIds: adventure.delvers.map(delver => delver.id),
			adventure: adventure.name
		};
		setCompany(company);
	}
	adventure.delvers.forEach(delver => {
		if (adventure.state !== "giveup") {
			const player = getPlayer(delver.id, guildId);
			if (player.scores[guildId]) {
				player.scores[guildId].total += finalScore;
				if (finalScore > player.scores[guildId].high) {
					player.scores[guildId].high = finalScore;
				}
			} else {
				player.scores[guildId] = { total: finalScore, high: finalScore };
			}
			if (finalScore > player.archetypes[delver.archetype]) {
				player.archetypes[delver.archetype] = finalScore;
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
function roomHeaderString(adventure) {
	return `Lives: ${adventure.lives} - Party Gold: ${adventure.gold} - Score: ${adventure.getBaseScore().total}`;
}

/** The room header goes in the embed's author field and should contain information about the party's commonly used or important resources
 * @param {Adventure} adventure
 * @param {Message} message
 */
function updateRoomHeader(adventure, message) {
	message.edit({ embeds: message.embeds.map(embed => new EmbedBuilder(embed).setAuthor({ name: roomHeaderString(adventure), iconURL: message.client.user.displayAvatarURL() })) })
}

/** The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project */
async function generateVersionEmbed() {
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

	const embed = embedTemplate()
		.setTitle(data.slice(titleStart + 3, changesStartRegEx.lastIndex))
		.setURL('https://discord.gg/JxqE9EpKt9')
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png')
		.setTimestamp();

	if (knownIssuesStart && knownIssuesStart < knownIssuesEnd) {
		// Known Issues section found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart))
			.addFields({ name: "Known Issues", value: data.slice(knownIssuesStart + 16, knownIssuesEnd) });
	} else {
		// Known Issues section not found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd));
	}
	return embed.addFields({ name: "Become a Sponsor", value: "Chip in for server costs or get premium features by sponsoring [PotL on GitHub](https://github.com/Imaginary-Horizons-Productions/Prophets-of-the-Labyrinth)" });
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
		const artifactCopy = Object.assign({}, adventure.getArtifactCount(artifactTemplate.name));
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
	const durabilityText = [Infinity, 0].includes(maxDurability) ? "" : ` (${generateTextBar(durability, maxDurability, Math.min(maxDurability, 10))} ${durability}/${maxDurability} durability)`;
	return {
		name: `${gearName} ${getEmoji(getGearProperty(gearName, "element"))}${durabilityText}`,
		value: buildGearDescription(gearName, maxDurability !== 0)
	};
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} gearCapacity
 * @returns {MessagePayload}
 */
function inspectSelfPayload(delver, gearCapacity) {
	const embed = new EmbedBuilder().setColor(getColor(delver.element))
		.setAuthor(randomAuthorTip())
		.setTitle(`${delver.getName()} the ${delver.archetype}`)
		.setDescription(`${generateTextBar(delver.hp, delver.getMaxHP(), 11)} ${delver.hp}/${delver.getMaxHP()} HP\nPoise: ${generateTextBar(delver.stagger, delver.getPoise(), delver.getPoise())} Stagger\nYour ${getEmoji(delver.element)} moves add 2 Stagger to enemies and remove 1 Stagger from allies.`);
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
	randomAuthorTip,
	randomFooterTip,
	embedTemplate,
	renderRoom,
	updateRoomHeader,
	generateVersionEmbed,
	generateArtifactEmbed,
	gearToEmbedField,
	inspectSelfPayload
};
