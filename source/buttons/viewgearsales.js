const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require('../constants');

const mainId = "viewgearsales";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Create select with sellable gear options */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const pricePercent = 50;
		const saleOptions = delver.gear.map((gear, index) => {
			const maxDurability = getGearProperty(gear.name, "maxDurability");
			if (maxDurability > 0) {
				return {
					label: `${gear.name} (${gear.durability}/${maxDurability})`,
					description: `${getGearProperty(gear.name, "cost") * pricePercent / 100 * gear.durability / maxDurability}g`,
					value: index.toString()
				};
			} else {
				return {
					label: `${gear.name}`,
					description: `${getGearProperty(gear.name, "cost") * pricePercent / 100}g`,
					value: index.toString()
				};
			}
		});
		if (saleOptions.length > 0) {
			interaction.reply({
				content: "The Merchant marks down the price for the damage on the gear.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`sellgear${SAFE_DELIMITER}${pricePercent}`)
							.setPlaceholder("Select a piece of gear to sell...")
							.setOptions(saleOptions)
					)
				],
				ephemeral: true
			})
		} else {
			interaction.reply({
				content: "The Merchant marks down the price for the damage on the gear.",
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId(`sellgear${SAFE_DELIMITER}${pricePercent}`)
							.setPlaceholder("No gear to sell...")
							.setOptions(EMPTY_SELECT_OPTION_SET)
							.setDisabled(true)
					)
				],
				ephemeral: true
			})
		}
	}
);
