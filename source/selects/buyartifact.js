const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, DiscordjsErrorCodes } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor } = require('../util/essenceUtil');
const { getArtifact } = require('../artifacts/_artifactDictionary');

const mainId = "buyartifact";
module.exports = new SelectWrapper(mainId, 3000,
	/** Allow the party to buy an artifact at a merchant */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const [name] = interaction.values;
		const { count, cost } = adventure.room.resources[name];
		if (count < 1) {
			interaction.reply({ content: `There are no more ${name} for sale.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.gold < cost) {
			interaction.reply({ content: "You don't have enough money to buy that.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(getColor(adventure.room.essence))
					.setAuthor(randomAuthorTip())
					.setTitle("Buy this artifact?")
					.addFields({ name, value: getArtifact(name).dynamicDescription(1) })
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(SKIP_INTERACTION_HANDLING)
						.setStyle(ButtonStyle.Success)
						.setLabel(`Buy for ${cost}g`)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
			if (name in adventure.room.resources) {
				adventure.gold -= cost;
				adventure.room.decrementResource(name, 1);
				adventure.gainArtifact(name, 1);
				interaction.message.edit(renderRoom(adventure, interaction.channel));
				collectedInteraction.channel.send({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
				setAdventure(adventure);
				return collectedInteraction.update({ components: [] });
			}
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
