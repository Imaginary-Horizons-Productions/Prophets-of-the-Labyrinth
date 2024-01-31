const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { transformGear } = require('../util/delverUtil');
const { editButtons, consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "randomtinker";
module.exports = new SelectWrapper(mainId, 3000,
	/** Randomly select a sidegrade for a given piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const [gearName, index] = interaction.values[0].split(SAFE_DELIMITER);
		/** @type {string[]} */
		const sidegrades = getGearProperty(gearName, "sidegrades");
		const sidegradeName = sidegrades[adventure.generateRandomNumber(sidegrades.length, "general")];
		transformGear(delver, index, gearName, sidegradeName);
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
			interaction.channel.send(`**${interaction.member.displayName}**'s *${gearName}* has been tinkered to **${sidegradeName}**!`);
			setAdventure(adventure);
		})
	}
);
