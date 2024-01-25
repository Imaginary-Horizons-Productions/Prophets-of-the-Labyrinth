const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { EMPTY_SELECT_OPTION_SET } = require('../constants');
const { gainHealth } = require('../util/combatantUtil');

const mainId = "applepiewishingwell";
module.exports = new SelectWrapper(mainId, 3000,
	/** Disable steal core, give item, regain hp */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const [tossedItem] = interaction.values;
		adventure.decrementItem(tossedItem, 1);
		gainHealth(delver, delver.maxHP, adventure);
		interaction.update({
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(mainId)
						.setPlaceholder(`${tossedItem} tossed`)
						.setOptions(EMPTY_SELECT_OPTION_SET)
						.setDisabled(true)
				),
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId("stealwishingwellcore")
						.setLabel("Core left alone")
						.setEmoji("✖️")
						.setStyle(ButtonStyle.Primary)
						.setDisabled(true)
				),
				interaction.message.components[2]
			]
		});
		interaction.channel.send(`The ${tossedItem} becomes an apple pie. ${delver.getName()} is fully healed by the delicious pie.`)
	}
);
