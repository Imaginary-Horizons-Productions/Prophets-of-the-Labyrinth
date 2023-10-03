const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { getGearProperty } = require('../gear/_gearDictionary');
const { renderRoom } = require('../util/embedUtil');

const mainId = "buygear";
module.exports = new SelectWrapper(mainId, 3000,
	/** Create the gear details embed so player can decide whether to make the purchase */
	(interaction, [tier]) => {
		const adventure = getAdventure(interaction.channel.id);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		const [name, menuIndex] = interaction.values[0].split(SAFE_DELIMITER);
		const { count, cost } = adventure.room.resources[name];
		if (count > 0) {
			if (adventure.gold >= cost) {
				if (delver.gear.length < adventure.getGearCapacity()) {
					adventure.gold -= cost;
					adventure.room.resources[name].count--;
					delver.gear.push({ name, durability: getGearProperty(name, "maxDurability") });
					interaction.message.edit(renderRoom(adventure, interaction.channel));
					interaction.reply({ content: `${interaction.member.displayName} buys a ${name} for ${cost}g.` });
					setAdventure(adventure);
				} else {
					let replaceUI = [new ActionRowBuilder().addComponents(
						delver.gear.map((gear, index) => {
							return new ButtonBuilder().setCustomId(`replacegear${SAFE_DELIMITER}${name}${SAFE_DELIMITER}${index}${SAFE_DELIMITER}false`)
								.setLabel(`Discard ${gear.name}`)
								.setStyle(ButtonStyle.Secondary)
						})
					)];
					interaction.reply({ content: `You can only carry ${adventure.getGearCapacity()} pieces of gear at a time. Pick one to replace:`, components: replaceUI, ephemeral: true });
				}
			} else {
				interaction.reply({ content: "You don't have enough money to buy that.", ephemeral: true });
			}
		} else {
			interaction.reply({ content: `There are no more ${name} for sale.`, ephemeral: true });
		}
	}
);
