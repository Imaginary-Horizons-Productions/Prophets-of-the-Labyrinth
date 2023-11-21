const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { SAFE_DELIMITER } = require('../constants');
const { trimForSelectOptionDescription } = require('../util/textUtil');

const mainId = "upgrade";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Present the user with an opportunity to upgrade a piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const options = [];
		delver.gear.forEach((gear, index) => {
			const upgrades = getGearProperty(gear.name, "upgrades");
			if (upgrades.length > 0) {
				options.push({
					label: gear.name,
					description: trimForSelectOptionDescription(`Results: ${upgrades.join(", ")}`),
					value: `${gear.name}${SAFE_DELIMITER}${index}`
				})
			}
		})
		if (options.length < 1) {
			interaction.reply({ content: "You don't have any gear that can be upgraded.", ephemeral: true });
			return;
		}

		interaction.reply({
			content: "You can use 1 room action to upgrade a piece of gear.",
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("randomupgrade")
						.setPlaceholder("Pick a piece of gear to randomly upgrade...")
						.setOptions(options)
				)
			],
			ephemeral: true
		});
	}
);
