const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact, artifactNames } = require('../artifacts/_artifactDictionary');
const { RN_TABLE_BASE, SKIP_INTERACTION_HANDLING } = require('../constants');
const { trimForSelectOptionDescription } = require('../util/textUtil');

const mainId = "startingartifacts";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select a starting artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
		const options = [{ label: "None", description: "Deselect your picked starting artifact", value: "None" }];

		// This randomizer is separate from the Adventure method because it doesn't advance the rnIndex so that players can't reroll starting artifacts by pushing the button again
		let start = parseInt(interaction.user.id) % adventure.rnTable.length;
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

		interaction.reply({
			content: `You can bring 1 of the following artifacts on this adventure (if you've collected that artifact from a previous adventure):${artifactBulletList}\nEach player will have a different set of artifacts to select from.`,
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
						.setPlaceholder("Select an artifact...")
						.addOptions(options)
				)
			],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				const adventure = getAdventure(collectedInteraction.channelId);
				const delver = adventure?.delvers.find(delver => delver.id === collectedInteraction.user.id);
				const [artifactName] = collectedInteraction.values;
				if (delver?.startingArtifact === "" && artifactName === "None" || adventure.state !== "config") {
					return;
				}

				if (artifactName === "None") {
					delver.startingArtifact = "";
					collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** has decided not to bring a starting artifact.`);
				} else {
					const isSwitching = delver.startingArtifact !== "";
					delver.startingArtifact = artifactName;
					collectedInteraction.channel.send(`**${collectedInteraction.member.displayName}** ${isSwitching ? "has switched to" : "is taking"} ${artifactName} for their starting artifact.`);
				}
				setAdventure(adventure);
			})

			collector.on("end", () => {
				interaction.deleteReply();
			})
		})
	}
);
