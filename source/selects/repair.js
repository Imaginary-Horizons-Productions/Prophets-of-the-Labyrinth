const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { editButtons, consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "repair";
module.exports = new SelectWrapper(mainId, 3000,
	/** Grant half the selected gear's max durability */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (adventure.room.resources.roomAction.count > 0) {
			const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
			const [gearName, index, value] = interaction.values[0].split(SAFE_DELIMITER);
			user.gear[Number(index)].durability += Number(value);
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				const { embeds, remainingActions } = consumeRoomActions(adventure, roomMessage.embeds, 1);
				let components = roomMessage.components;
				if (remainingActions < 1) {
					components = editButtons(components, {
						"upgrade": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" },
						"viewrepairs": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" }
					})
				}
				return roomMessage.edit({ embeds, components });
			}).then(() => {
				interaction.update({ components: [] });
				interaction.channel.send({ content: `${interaction.user} repaired ${value} durability on their ${gearName}.` });
				setAdventure(adventure);
			})
		} else {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
		}
	}
);
