const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact, artifactNames } = require('../artifacts/_artifactDictionary');
const { RN_TABLE_BASE, SKIP_INTERACTION_HANDLING, SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require('../constants');
const { trimForSelectOptionDescription } = require('../util/textUtil');

const mainId = "startingartifacts";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select a starting artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
		const options = [];

		// This randomizer is separate from the Adventure method because it doesn't advance the rnIndex so that players can't reroll starting artifacts by pushing the button again
		// Based on Discord snowflake generation, the bits from 22 to 27 refer to the ms out of 64 ms interals a user created their account on
		let start = Number(BigInt(interaction.user.id) >> 22n & 63n);
		const artifactsRolledSoFar = new Set();
		let artifactBulletList = "";
		const playerArtifactCollection = Object.values(playerProfile.artifacts);
		for (let i = 0; i < 5; i++) {
			const digits = Math.ceil(Math.log2(artifactNames.length) / Math.log2(RN_TABLE_BASE));
			const end = (start + digits) % adventure.rnTable.length;
			const max = RN_TABLE_BASE ** digits;
			const sectionLength = max / artifactNames.length;
			let tableSegment = adventure.rnTable.slice(start, end);
			if (start > end) {
				tableSegment = `${adventure.rnTable.slice(start)}${adventure.rnTable.slice(0, end)}`;
			}
			const roll = parseInt(tableSegment, RN_TABLE_BASE);
			const rolledArtifact = artifactNames[Math.floor(roll / sectionLength)];
			if (!artifactsRolledSoFar.has(rolledArtifact)) {
				artifactBulletList += `\n- ${rolledArtifact}`;
				artifactsRolledSoFar.add(rolledArtifact);
				if (playerArtifactCollection.includes(rolledArtifact)) {
					options.push({
						label: rolledArtifact,
						description: trimForSelectOptionDescription(getArtifact(rolledArtifact).dynamicDescription(1)),
						value: rolledArtifact
					})
				}
			}
			start = (start + 1) % adventure.rnTable.length;
		}

		const artifactSelect = new StringSelectMenuBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${SAFE_DELIMITER}add`)
			.setPlaceholder("Select an artifact...");
		if (options.length > 0) {
			artifactSelect.addOptions(options);
		} else {
			artifactSelect.addOptions(EMPTY_SELECT_OPTION_SET)
				.setDisabled(true);
		}

		interaction.reply({
			content: `You can bring 1 of the following artifacts on this adventure (if you've collected that artifact from a previous adventure):${artifactBulletList}\nEach player will have a different set of artifacts to select from.`,
			components: [
				new ActionRowBuilder().addComponents(artifactSelect),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`${SKIP_INTERACTION_HANDLING}${SAFE_DELIMITER}clear`)
						.setStyle(ButtonStyle.Danger)
						.setLabel("Deselect Starting Artifact")
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
			const adventure = getAdventure(collectedInteraction.channelId);
			const delver = adventure?.delvers.find(delver => delver.id === collectedInteraction.user.id);
			const [_, mainId] = collectedInteraction.customId.split(SAFE_DELIMITER);

			if (!delver || adventure.state !== "config") {
				return collectedInteraction;
			} else if (mainId === "add") {
				const isSwitching = delver.startingArtifact !== "";
				const [artifactName] = collectedInteraction.values;
				delver.startingArtifact = artifactName;
				collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** ${isSwitching ? "has switched to" : "is taking"} *${artifactName}* for their starting artifact.`);
			} else {
				delver.startingArtifact = "";
				collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** has decided not to bring a starting artifact.`);
			}
			setAdventure(adventure);
			return collectedInteraction;
		}).then(interactionToAcknowledge => {
			return interactionToAcknowledge.update({ components: [] });
		}).catch(error => {
			if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
				console.error(error);
			}
		}).finally(() => {
			if (interaction.channel) { // prevent crash if channel is deleted before cleanup
				interaction.deleteReply();
			}
		})
	}
);
