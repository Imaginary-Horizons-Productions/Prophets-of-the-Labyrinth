const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getGearProperty } = require('../gear/_gearDictionary');

const mainId = "viewrepairs";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Allow the user to select a piece of gear to regain uses on */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const options = [];
		delver.gear.forEach((gear, index) => {
			let maxUses = getGearProperty(gear.name, "maxUses");
			if (maxUses > 0 && gear.uses < maxUses) {
				let value = Math.min(Math.ceil(maxUses / 2), maxUses - gear.uses);
				options.push({
					label: gear.name,
					description: `Regain ${value} uses`,
					value: `${gear.name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}${value}`
				})
			}
		})
		if (adventure.room.resources.roomAction.count > 0) {
			if (options.length > 0) {
				let upgradeSelect = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId("repair")
						.setPlaceholder("Pick a piece of gear to repair...")
						.setOptions(options)
				)
				interaction.reply({ content: "You can use 1 room action to repair a piece of gear. That piece of gear will regain half its max uses.", components: [upgradeSelect], ephemeral: true });
			} else {
				interaction.reply({ content: "None of your gear needs repair.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	}
);
