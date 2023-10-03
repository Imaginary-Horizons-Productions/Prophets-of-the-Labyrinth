const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getColor } = require('../util/elementUtil');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS } = require('../constants');
const { getItem } = require('../items/_itemDictionary');

const mainId = "";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure?.delvers.find(delver => delver.id == interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}
		if (delver.getModifierStacks("Stun") > 0) { // Early out if stunned
			interaction.reply({ content: "You cannot pick a move because you are stunned this round.", ephemeral: true });
			return;
		}

		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(getColor(adventure.room.element))
					.setTitle("Readying an Item")
					.setDescription("Using an item has priority (it'll happen before non-priority actions).\n\nPick one option from below as your move for this round:")
					.setFooter({ text: "Imaginary Horizons Productions", iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png" })
			],
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(`item${SAFE_DELIMITER}${adventure.room.round}`)
						.setPlaceholder("Pick an item...")
						.addOptions(Object.keys(adventure.items).slice(0, MAX_SELECT_OPTIONS).reduce((options, item) => options.concat({
							label: `${item} (Held: ${adventure.items[item]})`,
							description: getItem(item).description,
							value: item
						}), [])))
			],
			ephemeral: true
		}).catch(console.error);
	}
);
