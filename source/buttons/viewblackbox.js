const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "viewblackbox";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow delver to select a piece of gear to trade for the black box gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const blackBoxResource = Object.values(adventure.room.resources).find(resource => resource.type === "gear");
		if (blackBoxResource.count < 1) {
			interaction.reply({ content: "The black box has already been opened.", ephemeral: true });
			return;
		}

		if (delver.gear.length < 1) {
			interaction.reply({ content: "You don't have any gear to trade.", ephemeral: true });
			return;
		}

		interaction.reply({
			content: "You can trade a piece of gear the mysterious Rare gear in the black box.",
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("blackboxgear")
						.setPlaceholder("Pick a piece of gear to trade...")
						.setOptions(delver.gear.map((gear, index) => ({
							label: gear.name,
							value: index.toString()
						})))
				)
			],
			ephemeral: true
		});
	}
);
