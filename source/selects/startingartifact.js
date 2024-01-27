const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact } = require('../artifacts/_artifactDictionary');

const mainId = "startingartifact";
module.exports = new SelectWrapper(mainId, 3000,
	/** Set the player's starting artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure?.state !== "config") {
			interaction.reply({ content: "A valid adventure could not be found.", ephemeral: true });
			return;
		}

		// Add delver to list (or overwrite)
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const [artifactName] = interaction.values;
		if (artifactName === "None") {
			delver.startingArtifact = "";
			interaction.channel.send(`**${interaction.member.displayName}** is not planning to bring a starting artifact.`);
			interaction.update({
				content: "Forgoing a starting artifact will increase your end of adventure score multiplier (up to 2x if no one takes a starting artifact).",
				components: [new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder(interaction.component.data).setPlaceholder("Pick an artifact after all...")
				)]
			});
		} else {
			const isSwitching = delver.startingArtifact !== "";
			delver.startingArtifact = artifactName;

			// Send confirmation text
			interaction.update({
				content: getArtifact(artifactName).dynamicDescription(1),
				components: [new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder(interaction.component.data).setPlaceholder("Pick a different artifact...")
				)]
			});
			interaction.channel.send(`**${interaction.member.displayName}** ${isSwitching ? "has switched to" : "is taking"} ${artifactName} for their starting artifact.`);
		}
		setAdventure(adventure);
	}
);
