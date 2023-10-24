const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact, getAllArtifactNames } = require('../artifacts/_artifactDictionary');

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
		let start = parseInt(interaction.user.id) % adventure.rnTable.length;
		const artifactsRolledSoFar = new Set();
		let artifactBulletList = "";
		const playerArtifactCollection = Object.values(playerProfile.artifacts);
		for (let i = 0; i < 5; i++) {
			const digits = Math.ceil(Math.log2(artifactPool.length) / Math.log2(12));
			const end = (start + digits) % adventure.rnTable.length;
			const max = 12 ** digits;
			const sectionLength = max / artifactPool.length;
			const roll = parseInt(adventure.rnTable.slice(start, end), 12);
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
			start++;
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
