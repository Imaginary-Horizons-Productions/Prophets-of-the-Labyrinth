const fs = require("fs");
const { ActionRowBuilder, ButtonBuilder, ThreadChannel, EmbedBuilder, ButtonStyle, Colors, EmbedAuthorData, EmbedFooterData, EmbedField, MessagePayload, Message, MessageFlags, StringSelectMenuBuilder, User } = require("discord.js");

const { Adventure, ArtifactTemplate, Delver, Player } = require("../classes");
const { DISCORD_ICON_URL, POTL_ICON_URL, SAFE_DELIMITER, MAX_BUTTONS_PER_ROW, MAX_EMBED_DESCRIPTION_LENGTH, MAX_MESSAGE_ACTION_ROWS, MAX_SELECT_OPTIONS, EMPTY_SELECT_OPTION_SET, MAX_EMBED_FIELD_COUNT } = require("../constants");

const { getChallenge, getStartingChallenges } = require("../challenges/_challengeDictionary");
const { buildGearDescriptionWithHolderStats } = require("../gear/_gearDictionary");
const { getModifierDescription, getModifierCategory, getRoundDecrement, getMoveDecrement, getInverse } = require("../modifiers/_modifierDictionary");
const { getRoom } = require("../rooms/_roomDictionary");

const { getEmoji, getColor } = require("./essenceUtil");
const { ordinalSuffixEN, generateTextBar, getNumberEmoji, trimForSelectOptionDescription, listifyEN } = require("./textUtil");
const { getApplicationEmojiMarkdown } = require("./graphicsUtil");

const { getCompany, setCompany } = require("../orcustrators/companyOrcustrator");
const { getPlayer, setPlayer } = require("../orcustrators/playerOrcustrator");
const { getArtifactCounts } = require("../artifacts/_artifactDictionary");
const { isSponsor } = require("./fileUtil");
const { getPetTemplate, getPetMoveDescription, PET_NAMES } = require("../pets/_petDictionary");
const { getArchetypesCount } = require("../archetypes/_archetypeDictionary");

const discordTips = [
	"Message starting with @silent don't send notifications; good for when everyone's asleep.",
	"Don't forget to check slash commands for optional arguments.",
	"Some slash commands can be used in DMs, others can't.",
	"Server subscriptions cost more on mobile because the mobile app stores take a cut.",
];
const potlTips = [
	"Combatants lose their next turn (Stun) when their Stagger reaches their Poise.",
	"Using items has priority.",
	"Gear that matches your essence relieves 1 Stagger for allies.",
	"Gear that matches your essence inflicts 2 Stagger on foes.",
	"Combatant speed varies every round.",
	"Damage is capped to 199 in one attack without any Excellence.",
	"Check party status even when there isn't a button for it with '/adventure party-stats'!",
	"Check your hp and gear even when there isn't a button for it with '/adventure inspect-self'!",
	"Combatants shrug off 1 Stagger each round by default.",
	"Look up game information at any time with '/manual'!",
	"Enemy HP is randomized outside of Final Battles.",
	"Numbers based on user stats will be surrounded in [], formulae will be surrounded in <>."
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

	return new EmbedBuilder().setColor(getColor(adventure.essence))
		.setAuthor({ name: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png", url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth" })
		.setTitle(adventure.name)
		.setThumbnail(isAdventureCompleted ? "https://cdn.discordapp.com/attachments/545684759276421120/734092918369026108/completion.png" : "https://cdn.discordapp.com/attachments/545684759276421120/734093574031016006/bountyboard.png")
		.setDescription(description)
		.addFields(fields);
}

function generateAdventureConfigMessage() {
	const options = getStartingChallenges().map(challengeName => {
		const challenge = getChallenge(challengeName);
		return { label: challengeName, description: trimForSelectOptionDescription(challenge.dynamicDescription(challenge.intensity, challenge.duration, challenge.reward)), value: challengeName };
	})
	return {
		content: "Each player must select an archetype and can optionally select a starting artifact. The adventure will begin when everyone clicks the \"Ready!\" button.",
		components: [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId("ready")
					.setLabel("Ready!")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId("deploy")
					.setEmoji("🆔")
					.setLabel("Pick Archetype")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId("deploypet")
					.setEmoji("🐾")
					.setLabel("Bring a Pet")
					.setStyle(ButtonStyle.Secondary),
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
	const roomEmbed = new EmbedBuilder().setColor(getColor(adventure.room.essence))
		.setAuthor({ name: roomHeaderString(adventure), iconURL: thread.client.user.displayAvatarURL() })
		.setTitle(adventure.room.title ?? "in setup")
		.setFooter({ text: `Room #${adventure.depth}` });

	const roomTemplate = getRoom(adventure.room.title);
	if (descriptionOverride || roomTemplate) {
		roomEmbed.setDescription(descriptionOverride || roomTemplate.description.replace("@{roomEssence}", adventure.room.essence));
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
			if (adventure.room.actions > 0) {
				roomEmbed.addFields({ name: `Room Actions: ${getNumberEmoji(adventure.room.actions)}`, value: `The party can take ${adventure.room.actions} more actions in this room. Action costs will be noted with similar emoji on the UI component.` });
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
	let breakdownText = generateScoreline("additive", "Depth", adventure.depth);
	breakdownText += generateScoreline("additive", "Lives", livesScore);
	breakdownText += generateScoreline("additive", "Gold", goldScore);
	breakdownText += generateScoreline("additive", "Artifact Guardians Defeated", guardianScore);
	breakdownText += generateScoreline("additive", "Bonus", adventure.score);
	let challengeMultiplier = 1;
	Object.keys(adventure.challenges).forEach(challengeName => {
		const challenge = getChallenge(challengeName);
		challengeMultiplier *= challenge.scoreMultiplier;
	})
	const skippedArtifactsMultiplier = 1 + (adventure.delvers.reduce((count, delver) => delver.startingArtifact ? count : count + 1, 0) / adventure.delvers.length);
	const skippedPetsMultiplier = 1 + (adventure.delvers.reduce((count, delver) => delver.pet ? count : count + 1, 0) / adventure.delvers.length);
	const floatingMultiplierBonus = 1 + (adventure.getArtifactCount("Floating Multiplier") / 4);
	// Skip multiplicative bonuses if score is negative
	if (finalScore > 0) {
		finalScore *= challengeMultiplier;
		breakdownText += generateScoreline("multiplicative", "Challenges Multiplier", challengeMultiplier);
		finalScore = Math.max(1, finalScore * skippedArtifactsMultiplier);
		breakdownText += generateScoreline("multiplicative", "Artifact Skip Multiplier", skippedArtifactsMultiplier);
		breakdownText += generateScoreline("multiplicative", "Pet Skip Multiplier", skippedPetsMultiplier);
		breakdownText += generateScoreline("multiplicative", "Floating Multiplier Bonus", floatingMultiplierBonus);
		switch (adventure.state) {
			case "success":
				embed.setTitle(`Success in ${adventure.labyrinth}`);
				break;
			case "defeat":
				embed.setTitle(`Defeated${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
				finalScore = Math.floor(finalScore / 2);
				breakdownText += generateScoreline("multiplicative", "Defeat", 0.5);
				break;
			case "giveup":
				embed.setTitle(`Gave up${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
				finalScore = 0;
				breakdownText += generateScoreline("multiplicative", "Give Up", adventure.state === "giveup" ? 0 : 1);
				break;
		}
	} else {
		if (challengeMultiplier > 1) {
			breakdownText += `Challenges Multiplier: ~~x${challengeMultiplier}~~ x1\n`;
		}
		if (skippedArtifactsMultiplier > 1) {
			breakdownText += `Artifact Skip Multiplier: ~~x${skippedArtifactsMultiplier}~~ x1\n`;
		}
		if (skippedPetsMultiplier > 1) {
			breakdownText += `Pet Skip Multiplier: ~~x${skippedPetsMultiplier}~~ x1\n`;
		}
		if (floatingMultiplierBonus > 1) {
			breakdownText += `Floating Multiplier Bonus: ~~x${floatingMultiplierBonus}~~ x1\n`;
		}
		switch (adventure.state) {
			case "success":
				embed.setTitle(`Success in ${adventure.labyrinth}`);
				break;
			case "defeat":
				embed.setTitle(`Defeated${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
				breakdownText += `Defeat: ~~x$0.5~~ x1\n`;
				break;
			case "giveup":
				embed.setTitle(`Gave up${adventure.room.title ? ` in ${adventure.room.title}` : " before even starting"}`);
				finalScore = 0;
				breakdownText += generateScoreline("multiplicative", "Give Up", adventure.state === "giveup" ? 0 : 1);
				break;
		}
	}
	embed.addFields({ name: "Score Breakdown", value: `${breakdownText}\n__Total__: ${finalScore}` });
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
	const changelogPath = "./ChangeLog.md";
	const data = await fs.promises.readFile(changelogPath, { encoding: 'utf8' });
	const stats = await fs.promises.stat(changelogPath);
	const dividerRegEx = /## .+ v\d+.\d+.\d+/g;
	const changesStartRegEx = /\.\d+:/g;
	let titleStart = dividerRegEx.exec(data).index;
	changesStartRegEx.exec(data);
	let knownIssuesEnd = dividerRegEx.exec(data).index;

	return embedTemplate()
		.setTitle(data.slice(titleStart + 3, changesStartRegEx.lastIndex))
		.setDescription(data.slice(changesStartRegEx.lastIndex, knownIssuesEnd).slice(0, MAX_EMBED_DESCRIPTION_LENGTH)).setURL('https://discord.gg/JxqE9EpKt9')
		.setThumbnail('https://cdn.discordapp.com/attachments/545684759276421120/734099622846398565/newspaper.png')
		.setTimestamp(stats.mtime)
		.addFields({ name: "Become a Sponsor", value: "Chip in for server costs or get premium features by sponsoring [PotL on GitHub](https://github.com/Imaginary-Horizons-Productions/Prophets-of-the-Labyrinth)" });
}

/**
 * @param {ArtifactTemplate} artifactTemplate
 * @param {number} count
 * @param {Adventure?} adventure
 */
function generateArtifactEmbed(artifactTemplate, count, adventure) {
	const embed = embedTemplate()
		.setTitle(`${getEmoji(artifactTemplate.essence)} ${artifactTemplate.name} x ${count} `)
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

const BUTTON_STYLES_BY_MODIFIER_CATEGORY = {
	"Buff": ButtonStyle.Primary,
	"Debuff": ButtonStyle.Danger,
	"State": ButtonStyle.Secondary
};

/** Generates an object to Discord.js's specification that corresponds with a delver's in-adventure stats
 * @param {Delver} delver
 * @param {number} gearCapacity
 * @param {boolean} roomHasEnemies
 * @returns {MessagePayload}
 */
function inspectSelfPayload(delver, gearCapacity, roomHasEnemies) {
	const hasLucky = delver.getModifierStacks("Lucky") > 0;
	const hasUnlucky = delver.getModifierStacks("Unlucky") > 0;
	const description = `${generateTextBar(delver.hp, delver.getMaxHP(), 11)} ${delver.hp}/${delver.getMaxHP()} HP\nProtection: ${delver.protection}\nPoise: ${generateTextBar(delver.stagger, delver.getPoise(), delver.getPoise())} Stagger\nPower: ${delver.getPower()}\nSpeed: ${delver.getSpeed(false)}${roomHasEnemies ? ` ${delver.roundSpeed < 0 ? "-" : "+"} ${Math.abs(delver.roundSpeed)} (this round)` : ""}\nCrit Rate: ${delver.getCritRate()}%${hasLucky ? " x 2 (Lucky)" : hasUnlucky ? " ÷ 2 (Unlucky)" : ""}\nPet: ${delver.pet ? delver.pet : "None"}\n\n*(Your ${getEmoji(delver.essence)} moves add 2 Stagger to enemies and remove 1 Stagger from allies.)*`;
	const embed = new EmbedBuilder().setColor(getColor(delver.essence))
		.setAuthor(randomAuthorTip())
		.setTitle(`${delver.name} the Level ${delver.level} ${delver.archetype}`)
		.setDescription(description);
	if (delver.getModifierStacks("Iron Fist Stance") > 0) {
		embed.addFields({ name: "Iron Fist Punch", value: buildGearDescriptionWithHolderStats("Iron Fist Punch", null, delver) });
	} else if (delver.getModifierStacks("Floating Mist Stance") > 0) {
		embed.addFields({ name: "Floating Mist Punch", value: buildGearDescriptionWithHolderStats("Floating Mist Punch", null, delver) });
	} else {
		embed.addFields({ name: "Punch", value: buildGearDescriptionWithHolderStats("Punch", null, delver) });
	}
	for (let index = 0; index < Math.min(Math.max(delver.gear.length, gearCapacity), MAX_EMBED_FIELD_COUNT); index++) {
		if (delver.gear[index]) {
			const gearName = delver.gear[index].name;
			embed.addFields({ name: gearName, value: buildGearDescriptionWithHolderStats(gearName, index, delver) });
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
			const modifierButton = new ButtonBuilder().setCustomId(`modifier${SAFE_DELIMITER}${modifierName}${SAFE_DELIMITER}${i}`)
				.setLabel(`${modifierName} x ${delver.modifiers[modifierName]}`)
				.setStyle(BUTTON_STYLES_BY_MODIFIER_CATEGORY[getModifierCategory(modifierName)])
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
	const embed = new EmbedBuilder().setColor(getColor(adventure.essence))
		.setAuthor(randomAuthorTip())
		.setTitle(`Party Stats - ${adventure.name}`)
		.setDescription(`Depth: ${adventure.depth}\nScore: ${adventure.getBaseScore().total}`)
		.addFields([
			{ name: `${adventure.lives} Lives Remaining`, value: "When a player runs out of HP, a life will be lost and they'll be returned to max HP. When all lives are lost, the adventure will end." },
			{ name: `${adventure.gold} Gold`, value: `Gold is exchanged for goods and services within adventures. *Gold will be lost when an adventure ends.*\nPeak Gold: ${adventure.peakGold}` },
			{ name: `Gear Capacity: ${gearCapacity}`, value: `Each delver can carry ${gearCapacity} pieces of gear. Gear capacity can be increased at Merchants and by finding the Hammerspace Holster artifact.` },
			{ name: "Items", value: Object.keys(adventure.items).map(item => `${item} x ${adventure.items[item]}`).join("\n") || "None" },
			{
				name: "Scouting",
				value: `Final Battle: ${adventure.scouting.bosses > 0 ? adventure.bosses[0] : "???"}\nArtifact Guardians: ${guardsScouted.length > 0 ?
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

/**
 * @param {User} user
 * @param {string} guildId
 */
function generateStatsEmbed(user, guildId) {
	let availability = getCompany(guildId)?.adventuring.has(user.id) ? "❌ Out on adventure" : "🟢 Available for adventure";
	if (isSponsor(user.id)) {
		availability = "💎 Available for adventure (Premium)";
	}
	const player = getPlayer(user.id, guildId);
	let bestArchetype = "N/A";
	let highScore = 0;
	for (const archetype in player.archetypes) {
		const score = player.archetypes[archetype];
		if (score > highScore) {
			bestArchetype = archetype;
			highScore = score;
		}
	}
	const totalArtifacts = getArtifactCounts();
	return embedTemplate().setTitle(`Player Stats: ${user.displayName}`)
		.setThumbnail(POTL_ICON_URL)
		.setDescription(`${availability}\n\nTotal Score: ${Object.values(player.scores).map(score => score.total).reduce((total, current) => total += current, 0)}`)
		.addFields(
			{ name: `Best Archetype: ${bestArchetype}`, value: `High Score: ${highScore}` },
			{ name: "Favorites", value: `Archetype: ${player.favoriteArchetype ? player.favoriteArchetype : "Not Set"}\nPet: ${player.favoritePet ? player.favoritePet : "Not Set"}` },
			{ name: "Collection", value: `Artifacts Collected: ${Object.values(player.artifacts).length}/${totalArtifacts} Artifacts (${Math.floor(Object.values(player.artifacts).length / totalArtifacts * 100)}%)\nArchetypes Collected: ${Object.keys(player.archetypes).length}/${getArchetypesCount()} (${Math.floor(Object.keys(player.archetypes).length / getArchetypesCount()) * 100}%)\nPets Collected: ${Object.keys(player.pets).length}/${PET_NAMES.length} (${Math.floor(Object.keys(player.pets).length / PET_NAMES.length) * 100}%)` }
		)
}

const COLORS_BY_MODIFIER_CATEGORY = {
	"Buff": Colors.Blurple,
	"Debuff": Colors.Red,
	"State": Colors.LightGrey
};

function generateModifierEmbed(modifierName, count, bearerPoise, funnelCount) {
	const modifierCategory = getModifierCategory(modifierName);
	const fields = [{ name: "Category", value: modifierCategory, inline: true }];
	const durationField = { name: "Duration", value: "Until end of battle" };

	const inverse = getInverse(modifierName);
	if (inverse) {
		fields.push({ name: "Inverse", value: `${inverse} ${getApplicationEmojiMarkdown(inverse)}`, inline: true });
	}

	const roundDecrement = getRoundDecrement(modifierName);
	if (roundDecrement !== 0) {
		durationField.name += ` <-${roundDecrement} per round>`;
		if (roundDecrement === "all") {
			durationField.value = "Until next round";
		} else if (count === roundDecrement) {
			durationField.value = "[Until next round]";
		} else if (count % roundDecrement === 0) {
			durationField.value = `[${count / roundDecrement} rounds]`;
		} else {
			durationField.value = `[${Math.floor(count / roundDecrement) + 1} rounds]`;
		}
	}
	const moveDecrement = getMoveDecrement(modifierName);
	if (moveDecrement !== 0) {
		durationField.name += ` <-${roundDecrement} per move>`;
		if (moveDecrement === "all") {
			durationField.value = "Until next move";
		} else if (count === moveDecrement) {
			durationField.value = "[Until next move]";
		} else if (count % moveDecrement === 0) {
			durationField.value = `[${count / moveDecrement} moves]`;
		} else {
			durationField.value = `[${Math.floor(count / moveDecrement) + 1} moves]`;
		}
	}
	fields.push(durationField);
	return new EmbedBuilder().setColor(COLORS_BY_MODIFIER_CATEGORY[modifierCategory])
		.setAuthor(randomAuthorTip())
		.setTitle(`${modifierName} ${getApplicationEmojiMarkdown(modifierName)} x ${count}`)
		.setDescription(getModifierDescription(modifierName, count, bearerPoise, funnelCount))
		.addFields(fields)
}

/**
 * @param {string} petName
 * @param {Player} player
 */
function generatePetEmbed(petName, player) {
	const petTemplate = getPetTemplate(petName);
	const petLevel = player.pets[petName] ?? 0;
	const moveSets = [1, 2, 3, 4].map(level => {
		const [firstMoveName, firstMoveDescription] = getPetMoveDescription(petName, 0, level);
		const [secondMoveName, secondMoveDescription] = getPetMoveDescription(petName, 1, level);
		return { name: `Level ${level}${petLevel === level ? " - Your Pet's Here!" : ""}`, value: `${firstMoveName} - ${firstMoveDescription}\n${secondMoveName} - ${secondMoveDescription}` };
	});
	return new EmbedBuilder().setColor(petTemplate.color)
		.setAuthor(randomAuthorTip())
		.setTitle(petName)
		.setDescription("Pets improve their movesets as they level up.")
		.addFields(moveSets)
		.setFooter(randomFooterTip())
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
	inspectSelfPayload,
	generatePartyStatsPayload,
	generateStatsEmbed,
	generateModifierEmbed,
	generatePetEmbed
};
