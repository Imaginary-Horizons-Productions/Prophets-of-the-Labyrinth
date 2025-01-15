const { EmbedBuilder, Colors, MessageFlags } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { modifiersToString } = require('../util/combatantUtil');
const { randomAuthorTip, generateModifierEmbed } = require('../util/embedUtil');

const mainId = "modifier";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Provide details about the given modifier */
	(interaction, [modifierName]) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This adventure is no longer active.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (modifierName !== "MORE") {
			interaction.reply({ embeds: [generateModifierEmbed(modifierName, delver.modifiers[modifierName], delver.getPoise(), adventure.getArtifactCount("Spiral Funnel"))], flags: [MessageFlags.Ephemeral] });
		} else {
			interaction.reply({
				embeds: [
					new EmbedBuilder().setColor(Colors.LightGrey)
						.setAuthor(randomAuthorTip())
						.setTitle("All Modifiers")
						.setDescription(modifiersToString(delver, adventure))
				],
				flags: [MessageFlags.Ephemeral]
			});
		}
	}
);
