const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER, SKIP_INTERACTION_HANDLING } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom, randomAuthorTip } = require('../util/embedUtil');
const { getColor } = require('../util/essenceUtil');
const { getItem } = require('../items/_itemDictionary');
const { injectApplicationEmojiMarkdown } = require('../util/graphicsUtil');

const mainId = "buyitem";
module.exports = new SelectWrapper(mainId, 3000,
	/** Allow the party to buy an item at a merchant */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
		const { count, cost } = adventure.room.resources[name];
		if (count < 1) {
			interaction.reply({ content: `There are no more ${name} for sale.`, flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.gold < cost) {
			interaction.reply({ content: "You don't have enough money to buy that.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const embed = new EmbedBuilder().setColor(getColor(adventure.room.essence))
			.setAuthor(randomAuthorTip())
			.setTitle("Buy this item?")
			.addFields({ name, value: injectApplicationEmojiMarkdown(getItem(name).description) });
		interaction.reply({
			embeds: [embed],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(SKIP_INTERACTION_HANDLING)
						.setStyle(ButtonStyle.Success)
						.setLabel(`Buy for ${cost}g`)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(({ resource: { message: reply } }) => {
			const collector = reply.createMessageComponentCollector({ max: 1 });
			collector.on("collect", collectedInteraction => {
				if (name in adventure.room.resources) {
					adventure.gold -= cost;
					adventure.room.decrementResource(name, 1);
					adventure.gainItem(name, 1);
					interaction.message.edit(renderRoom(adventure, interaction.channel));
					collectedInteraction.channel.send({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
					setAdventure(adventure);
				}
			})

			collector.on("end", async (interactionCollection) => {
				await interactionCollection.first().update({ components: [] });
				interaction.deleteReply();
			})
		})
	}
);
