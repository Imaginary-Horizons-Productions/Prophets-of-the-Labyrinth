const { SelectWrapper } = require('../classes');
const { SAFE_DELIMITER, EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { transformGear } = require('../util/delverUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "randomupgrade";
module.exports = new SelectWrapper(mainId, 3000,
	/** Randomly select an upgrade for a given piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The workshop's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const [gearName, index] = interaction.values[0].split(SAFE_DELIMITER);
		/** @type {string[]} */
		const upgradePool = getGearProperty(gearName, "upgrades");
		const upgradeName = upgradePool[adventure.generateRandomNumber(upgradePool.length, "general")];
		transformGear(delver, index, gearName, upgradeName);
		adventure.room.history.Upgraders.push(delver.name);
		adventure.room.decrementResource("roomAction", 1);
		setAdventure(adventure);
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			return roomMessage.edit(renderRoom(adventure, interaction.channel));
		})
		interaction.update(EMPTY_MESSAGE_PAYLOAD);
		interaction.channel.send(`**${interaction.member.displayName}**'s *${gearName}* has been upgraded to **${upgradeName}**!`);
	}
);
