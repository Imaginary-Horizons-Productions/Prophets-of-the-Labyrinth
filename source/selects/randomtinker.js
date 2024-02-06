const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { transformGear } = require('../util/delverUtil');
const { renderRoom } = require('../util/embedUtil');

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
		adventure.room.history.Tinkerers.push(delver.name);
		adventure.room.decrementResource("roomAction", 1);
		interaction.update(renderRoom(adventure, interaction.channel));
		interaction.channel.send(`**${interaction.member.displayName}**'s *${gearName}* has been tinkered to **${sidegradeName}**!`);
		setAdventure(adventure);
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			return roomMessage.edit(renderRoom(adventure, interaction.channel));
		});
	}
);
