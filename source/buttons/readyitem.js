const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER, MAX_SELECT_OPTIONS } = require('../constants');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getColor } = require('../util/elementUtil');
const { randomAuthorTip } = require('../util/embedUtil');
const { getItem } = require('../items/_itemDictionary');

const mainId = "readyitem";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Show the delver stats of the user and provide components to ready a move */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
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
					.setAuthor(randomAuthorTip())
					.setTitle("Readying an Item")
					.setDescription("Using an item has priority (it'll happen before non-priority actions).\n\nPick one option from below as your move for this round:")
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
