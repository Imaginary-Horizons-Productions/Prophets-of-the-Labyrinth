const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact, getAllArtifactNames } = require('../artifacts/_artifactDictionary');
const { RN_TABLE_BASE } = require('../constants');

const mainId = "viewstartingartifacts";
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

		const artifactPool = getAllArtifactNames();
		// This randomizer is separate from the Adventure method because it doesn't advance the rnIndex so that players can't reroll starting artifacts by pushing the button again
		let start = parseInt(interaction.user.id) % adventure.rnTable.length;
		const artifactsRolledSoFar = new Set();
		let artifactBulletList = "";
		const playerArtifactCollection = Object.values(playerProfile.artifacts);
		for (let i = 0; i < 5; i++) {
			const digits = Math.ceil(Math.log2(artifactPool.length) / Math.log2(RN_TABLE_BASE));
			const end = (start + digits) % adventure.rnTable.length;
			const max = RN_TABLE_BASE ** digits;
			const sectionLength = max / artifactPool.length;
			let tableSegment = adventure.rnTable.slice(start, end);
			if (start > end) {
				tableSegment = `${adventure.rnTable.slice(start)}${adventure.rnTable.slice(0, end)}`;
			}
			const roll = parseInt(tableSegment, RN_TABLE_BASE);
			const rolledArtifact = artifactPool[Math.floor(roll / sectionLength)];
			if (!artifactsRolledSoFar.has(rolledArtifact)) {
				artifactBulletList += `\n- ${rolledArtifact}`;
				artifactsRolledSoFar.add(rolledArtifact);
				if (playerArtifactCollection.includes(rolledArtifact)) {
					options.push({
						label: rolledArtifact,
						description: getArtifact(rolledArtifact).dynamicDescription(1),
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
						.setCustomId("startingartifact")
						.setPlaceholder("Select an artifact...")
						.addOptions(options)
				)
			],
			ephemeral: true
		});
	}
);
