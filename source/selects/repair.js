const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { editButtons, consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "repair";
module.exports = new SelectWrapper(mainId, 3000,
	/** Grant half the selected gear's max durability */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const [gearName, index, value] = interaction.values[0].split(SAFE_DELIMITER);
		user.gear[Number(index)].durability += Number(value);
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			const { embeds, remainingActions } = consumeRoomActions(adventure, roomMessage.embeds, 1);
			let components = roomMessage.components;
			if (remainingActions < 1) {
				components = editButtons(components, {
					"gearcapup": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
					"tinker": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
					"upgrade": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
					"viewblackbox": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" },
					"viewrepairs": { preventUse: true, label: "Supplies exhausted", emoji: "✔️" }
				})
			}
			return roomMessage.edit({ embeds, components });
		}).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send({ content: `**${interaction.member.displayName}** repaired ${value} durability on their ${gearName}.` });
			setAdventure(adventure);
		})
	}
);
