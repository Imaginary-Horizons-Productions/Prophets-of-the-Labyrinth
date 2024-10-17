const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ThreadChannel, EmbedBuilder, ButtonStyle, Colors, EmbedAuthorData, EmbedFooterData, EmbedField, MessagePayload, Message, MessageFlags, StringSelectMenuBuilder } = require("discord.js");

const { Adventure, ArtifactTemplate, Delver } = require("../classes");
const { DISCORD_ICON_URL, POTL_ICON_URL, SAFE_DELIMITER, MAX_BUTTONS_PER_ROW, MAX_EMBED_DESCRIPTION_LENGTH, MAX_MESSAGE_ACTION_ROWS, MAX_SELECT_OPTIONS, EMPTY_SELECT_OPTION_SET, MAX_EMBED_FIELD_COUNT } = require("../constants");

const { getChallenge, getStartingChallenges } = require("../challenges/_challengeDictionary");
const { getGearProperty, buildGearDescription } = require("../gear/_gearDictionary");
const { getLabyrinthProperty } = require("../labyrinths/_labyrinthDictionary");
const { isBuff, isDebuff } = require("../modifiers/_modifierDictionary");
const { getRoom } = require("../rooms/_roomDictionary");

const { getEmoji, getColor } = require("./elementUtil");
const { ordinalSuffixEN, generateTextBar, getNumberEmoji, trimForSelectOptionDescription, listifyEN } = require("./textUtil");
const { getApplicationEmojiMarkdown, injectApplicationEmojiMarkdown } = require("./graphicsUtil");

const { getCompany, setCompany } = require("../orcustrators/companyOrcustrator");
const { getPlayer, setPlayer } = require("../orcustrators/playerOrcustrator");

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

/** @param {Adventure} adventure */
function generateRecruitEmbed(adventure) {
	// recruit embed must be set before making thread, but cannot add leader to delvers before thread is created
	const clampedPartySize = Math.max(adventure.delvers.length, 1);
	const nonLeaderIds = adventure.delvers.filter(delver => delver.id !== adventure.leaderId).map(delver => delver.id);
	const fields = [
		{
			name: `${clampedPartySize} Party Member${clampedPartySize === 1 ? "" : "s"}`,
			value: `<@${adventure.leaderId}> 👑${nonLeaderIds.length > 0 ? `\n<@${nonLeaderIds.join(">\n<@")}>` : ""}`
		}
	];
	const startingChallenges = Object.keys(adventure.challenges);
	if (Object.keys(adventure.challenges).length > 0) {
		fields.push({ name: "Challenges", value: `- ${startingChallenges.join("\n- ")}` });
	}
	const isAdventureCompleted = !["config", "ongoing"].includes(adventure.state);
	if (isAdventureCompleted) {
		fields.push({ name: "Seed", value: adventure.initialSeed });
	}

	let description = "";
	switch (adventure.state) {
		case "config":
			description = "An adventure is starting!";
			break;
		case "ongoing":
			description = "The adventure is on-going!";
			break;
		case "success":
			description = "The party succeeded on their adventure!";
			break;
		case "defeat":
		case "giveup":
			description = "The party retreated.";
			break;
	}

	return new EmbedBuilder().setColor(getColor(adventure.element))
		.setAuthor({ name: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png", url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
		.setTitle(adventure.name)
		.setThumbnail(isAdventureCompleted ? "https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png" : "https://cdn.discordapp.com/attachments/545684759276421120/734093574031016006/bountyboard.png")
		.setDescription(description)
		.addFields(fields);
}

/** @param {Adventure} adventure */
function generateAdventureConfigMessage(adventure) {
	const options = getStartingChallenges().map(challengeName => {
		const challenge = getChallenge(challengeName);
		return { label: challengeName, description: trimForSelectOptionDescription(challenge.dynamicDescription(challenge.intensity, challenge.duration)), value: challengeName };
	})
	return {
		content: `**${adventure.labyrinth}**\n*${injectApplicationEmojiMarkdown(getLabyrinthProperty(adventure.labyrinth, "description"))}*\nParty Leader: <@${adventure.leaderId}>\n\nThe adventure will begin when everyone clicks the "Ready!" button. Each player must select an archetype and can optionally select a starting artifact.`,
		components: [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId("ready")
					.setLabel("Ready!")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId("deploy")
					.setLabel("Pick Archetype")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId("startingartifacts")
					.setLabel("Pick Starting Artifact")
					.setStyle(ButtonStyle.Secondary)
			),
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId("startingchallenges")
					.setPlaceholder("Select challenge(s)...")
					.setMinValues(1)
					.setMaxValues(options.length)
					.addOptions(options)
			),
			new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId("clearstartingchallenges")
					.setStyle(ButtonStyle.Danger)
					.setLabel("Clear Starting Challenges")
			)
		],
		flags: MessageFlags.SuppressNotifications
	}
}

/** Derive the embeds and components that correspond with the adventure's state
 * @param {Adventure} adventure
 * @param {ThreadChannel} thread
 * @param {string} descriptionOverride
 */
function renderRoom(adventure, thread, descriptionOverride) {
	const roomEmbed = new EmbedBuilder().setColor(getColor(adventure.room.element))
		.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(adventure.room.title ?? "in setup")
		.setFooter({ text: `Room #${adventure.depth}` });

	const roomTemplate = getRoom(adventure.room.title);
	if (descriptionOverride || roomTemplate) {
		roomEmbed.setDescription(descriptionOverride || roomTemplate.description.replace("@{roomElement}", adventure.room.element));
	}

	switch (adventure.state) {
		case "defeat":
		case "giveup":
			addScoreField(roomEmbed, adventure, thread.guildId);
			return {
				embeds: [roomEmbed],
				components: []
			}
		case "success":
			addScoreField(roomEmbed, adventure, thread.guildId);
			return {
				embeds: [roomEmbed],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId("collectartifact")
							.setLabel("Collect Artifact")
							.setStyle(ButtonStyle.Success)
					)
				]
			}
		default:
			if ("roomAction" in adventure.room.resources) {
				roomEmbed.addFields({ name: "Room Actions", value: `${getNumberEmoji(adventure.room.resources.roomAction.count)} remaining` });
			}

			if (roomTemplate?.buildRoom) {
				return roomTemplate.buildRoom(roomEmbed, adventure);
			} else {
				return {
					embeds: [roomEmbed],
					components: []
				}
			}
	}
}

/** The score breakdown is added to a room embed to show how the players in the just finished adventure did
 * @param {MessageEmbed} embed
 * @param {Adventure} adventure
 * @param {string} guildId
 */
function addScoreField(embed, adventure, guildId) {
	let { livesScore, goldScore, guardianScore, total: finalScore } = adventure.getBaseScore();
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
	const guardianScoreline = generateScoreline("additive", "Artifact Guardians Defeated", guardianScore);
	const bonusScoreline = generateScoreline("additive", "Bonus", adventure.score);
	const challengesScoreline = generateScoreline("multiplicative", "Challenges Multiplier", challengeMultiplier);
	const skippedArtifactScoreline = generateScoreline("multiplicative", "Artifact Skip Multiplier", skippedArtifactsMultiplier);
	const artifactMultiplierScoreline = generateScoreline("multiplicative", "Floating Multiplier Bonus", 1 + (adventure.getArtifactCount("Floating Multiplier") / 4));
	const defeatScoreline = generateScoreline("multiplicative", "Defeat", adventure.state === "defeat" ? 0.5 : 1);
	const giveupScoreline = generateScoreline("multiplicative", "Give Up", adventure.state === "giveup" ? 0 : 1);
	embed.addFields({ name: "Score Breakdown", value: `${depthScoreLine}${livesScoreLine}${goldScoreline}${guardianScoreline}${bonusScoreline}${challengesScoreline}${skippedArtifactScoreline}${artifactMultiplierScoreline}${defeatScoreline}${giveupScoreline}\n__Total__: ${finalScore}` });
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
			console.error(new Error(`Generating scoreline with unregistered stackType: ${stackType} `));
	}
	return "";
}

/** A room embed's author field contains the most important or commonly viewed party resources and stats
 * @param {Adventure} adventure
 * @returns {string} text to put in the author name field of a room embed
 */
function roomHeaderString(adventure) {
	return `Lives: ${adventure.lives} - Party Gold: ${adventure.gold} - Score: ${adventure.getBaseScore().total} `;
}

/** The version embed lists the following: changes in the most recent update, known issues in the most recent update, and links to support the project */
async function generateVersionEmbed() {
	const data = await fs.promises.readFile('./ChangeLog.md', { encoding: 'utf8' });
	const dividerRegEx = /## .+ v\d+.\d+.\d+/g;
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
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesStart).slice(0, MAX_EMBED_DESCRIPTION_LENGTH))
			.addFields({ name: "Known Issues", value: data.slice(knownIssuesStart + 16, knownIssuesEnd) });
	} else {
		// Known Issues section not found
		embed.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd).slice(0, MAX_EMBED_DESCRIPTION_LENGTH));
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
		.setTitle(`${getEmoji(artifactTemplate.element)} ${artifactTemplate.name} x ${count} `)
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
 * @param {Delver} holder
 * @returns {EmbedField} contents for a message embed field
 */
function gearToEmbedField(gearName, durability, holder) {
	/** @type {number} */
	const maxDurability = getGearProperty(gearName, "maxDurability");
	const durabilityText = [Infinity, 0].includes(maxDurability) ? "" : ` (${generateTextBar(durability, maxDurability, Math.min(maxDurability, 10))} ${durability} /${maxDurability} durability)`;
	return {
		name: `${gearName} ${getEmoji(gearName === "Iron Fist Punch" ? holder.element : getGearProperty(gearName, "element"))}${durabilityText}`,
		value: buildGearDescription(gearName, true, holder)
	};
}

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} gearCapacity
 * @param {boolean} roomHasEnemies
 * @returns {MessagePayload}
 */
function inspectSelfPayload(delver, gearCapacity, roomHasEnemies) {
	const hasLucky = delver.getModifierStacks("Lucky") > 0;
	const hasUnlucky = delver.getModifierStacks("Unlucky") > 0;
	const description = `${generateTextBar(delver.hp, delver.getMaxHP(), 11)} ${delver.hp}/${delver.getMaxHP()} HP\nProtection: ${delver.protection}\nPoise: ${generateTextBar(delver.stagger, delver.getPoise(), delver.getPoise())} Stagger\nPower: ${delver.getPower()}\nSpeed: ${delver.getSpeed(false)}${roomHasEnemies ? ` ${delver.roundSpeed < 0 ? "-" : "+"} ${Math.abs(delver.roundSpeed)} (this round)` : ""}\nCrit Rate: ${delver.getCritRate()}%${hasLucky ? " x 2 (Lucky)" : hasUnlucky ? " ÷ 2 (Unlucky)" : ""}\n\n*(Your ${getEmoji(delver.element)} moves add 2 Stagger to enemies and remove 1 Stagger from allies.)*`;
	const embed = new EmbedBuilder().setColor(getColor(delver.element))
		.setAuthor(randomAuthorTip())
		.setTitle(`${delver.name} the Level ${delver.level} ${delver.archetype}`)
		.setDescription(description);
	if (delver.getModifierStacks("Iron Fist Stance") > 0) {
		embed.addFields(gearToEmbedField("Iron Fist Punch", Infinity, delver));
	} else if (delver.getModifierStacks("Floating Mist Stance") > 0) {
		embed.addFields(gearToEmbedField("Floating Mist Punch", Infinity, delver));
	} else {
		embed.addFields(gearToEmbedField("Punch", Infinity, delver));
	}
	for (let index = 0; index < Math.min(Math.max(delver.gear.length, gearCapacity), MAX_EMBED_FIELD_COUNT); index++) {
		if (delver.gear[index]) {
			embed.addFields(gearToEmbedField(delver.gear[index].name, delver.gear[index].durability, delver));
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
			const modifierButton = new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}${modifierName}${SAFE_DELIMITER}${i}`)
				.setLabel(`${modifierName} x ${delver.modifiers[modifierName]}`)
				.setStyle(style)
				.setEmoji(getApplicationEmojiMarkdown(modifierName));
			actionRow.push(modifierButton);
		}
		if (modifiers.length > 4) {
			actionRow.push(new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}MORE`)
				.setLabel(`${modifiers.length - 4} more...`)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(!["Chemist", "Ritualist", "Detective"].includes(delver.archetype)))
		}
		components.push(new ActionRowBuilder().addComponents(...actionRow));
	}
	return { embeds: [embed], components, ephemeral: true };
}

/** @param {Adventure} adventure */
function generatePartyStatsPayload(adventure) {
	const guardsScouted = adventure.artifactGuardians.slice(0, adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians);
	const gearCapacity = adventure.getGearCapacity();
	const embed = new EmbedBuilder().setColor(getColor(adventure.element))
		.setAuthor(randomAuthorTip())
		.setTitle(`Party Stats - ${adventure.name}`)
		.setDescription(`Depth: ${adventure.depth}\nScore: ${adventure.getBaseScore().total}`)
		.addFields([
			{ name: `${adventure.lives} Lives Remaining`, value: "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end." },
			{ name: `${adventure.gold} Gold`, value: `Gold is exchanged for goods and services within adventures. *Gold will be lost when an adventure ends.*\nPeak Gold: ${adventure.peakGold}` },
			{ name: `Gear Capacity: ${gearCapacity}`, value: `Each delver can carry ${gearCapacity} pieces of gear. Gear capacity can be increased at Tanning Workshops and by the Hammerspace Holster artifact.` },
			{ name: "Items", value: Object.keys(adventure.items).map(item => `${item} x ${adventure.items[item]}`).join("\n") || "None" },
			{
				name: "Scouting",
				value: `Final Battle: ${adventure.scouting.bosses.length > 0 ? adventure.bosses[0] : "???"}\nArtifact Guardians: ${guardsScouted.length > 0 ?
					guardsScouted.map((encounter, index) => {
						if (index + 1 <= adventure.scouting.artifactGuardiansEncountered) {
							return `~~${encounter}~~`;
						} else {
							return encounter;
						}
					}).join(", ") + "..." : "???"}`
			}
		]);
	const challenges = Object.keys(adventure.challenges);
	if (challenges.length) {
		embed.addFields({ name: "Challenges", value: listifyEN(Object.keys(adventure.challenges), false) });
	}
	const infoSelects = [];
	const allArtifacts = Object.keys(adventure.artifacts);
	const artifactPages = [];
	for (let i = 0; i < allArtifacts.length; i += MAX_SELECT_OPTIONS) {
		artifactPages.push(allArtifacts.slice(i, i + MAX_SELECT_OPTIONS));
	}
	if (artifactPages.length > 0) {
		embed.addFields({ name: "Artifacts", value: listifyEN(Object.entries(adventure.artifacts).map(entry => `${entry[0]} x ${entry[1].count}`)) })
		infoSelects.push(...artifactPages.slice(0, MAX_MESSAGE_ACTION_ROWS).map((page, index) =>
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(`artifact${SAFE_DELIMITER}${index}`)
					.setPlaceholder(`Get details about an artifact...${artifactPages.length > 1 ? ` (Page ${index + 1})` : ""}`)
					.setOptions(page.map(artifact => {
						const count = adventure.getArtifactCount(artifact);
						return {
							label: `${artifact} x ${count}`,
							value: `${artifact}${SAFE_DELIMITER}${count}`
						};
					}))
			)
		))
	} else {
		infoSelects.push(new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId("artifact")
				.setPlaceholder("No artifacts to inspect...")
				.setDisabled(true)
				.setOptions(EMPTY_SELECT_OPTION_SET)
		))
	}
	return { embeds: [embed], components: infoSelects, ephemeral: true };
}

module.exports = {
	randomAuthorTip,
	randomFooterTip,
	embedTemplate,
	generateRecruitEmbed,
	generateAdventureConfigMessage,
	renderRoom,
	roomHeaderString,
	generateVersionEmbed,
	generateArtifactEmbed,
	gearToEmbedField,
	inspectSelfPayload,
	generatePartyStatsPayload
};
