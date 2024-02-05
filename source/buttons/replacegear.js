const { ButtonWrapper } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');
const { buildGearRecord } = require('../gear/_gearDictionary');

const mainId = "replacegear";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Replace the delver's gear at the given index with the given gear */
	(interaction, [name, index, source]) => {
		const adventure = getAdventure(interaction.channelId);
		const { count, cost } = adventure.room.resources[name];
		if (count < 1) {
			interaction.update({ content: `There aren't any more ${name} to take.`, components: [] });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const discardedName = delver.gear[index].name;
		delver.gear.splice(index, 1, buildGearRecord(name, "max"));
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			adventure.room.decrementResource(name, 1);
			adventure.gold -= cost;
			if (source === "treasure") {
				adventure.room.decrementResource("roomAction", 1);
			}
			return roomMessage.edit(renderRoom(adventure, interaction.channel));
		}).then(() => {
			interaction.update(EMPTY_MESSAGE_PAYLOAD);
			let resultText = `**${interaction.member.displayName}**`;
			if (cost > 0) {
				resultText += ` buys a ${name} for ${cost}g`;
			} else {
				resultText += ` takes a ${name}`;
			}
			resultText += ` (${discardedName} discarded).`;
			interaction.channel.send(resultText);
			setAdventure(adventure);
		})
	}
);
