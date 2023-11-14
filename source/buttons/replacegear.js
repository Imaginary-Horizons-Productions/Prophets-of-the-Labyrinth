const { ButtonWrapper, Gear } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "replacegear";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Replace the delver's gear at the given index with the given gear */
	(interaction, [name, index, source]) => {
		const adventure = getAdventure(interaction.channelId);
		const { count, cost } = adventure.room.resources[name];
		if (count > 0) {
			const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
			const discardedName = delver.gear[index].name;
			delver.gear.splice(index, 1, new Gear(name, getGearProperty(gearName, "maxDurability"), getGearProperty(gearName, "maxHP"), getGearProperty(gearName, "speed"), getGearProperty(gearName, "critBonus"), getGearProperty(gearName, "poise")));
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				adventure.room.resources[name].count--;
				adventure.gold -= cost;
				if (source === "treasure") {
					adventure.room.resources.roomAction.count--;
				}
				return roomMessage.edit(renderRoom(adventure, interaction.channel));
			}).then(() => {
				interaction.update(EMPTY_MESSAGE_PAYLOAD);
				let resultText = `${interaction.user}`;
				if (cost > 0) {
					resultText += ` buys a ${name} for ${cost}g`;
				} else {
					resultText += ` takes a ${name}`;
				}
				resultText += ` (${discardedName} discarded).`;
				interaction.channel.send(resultText);
				setAdventure(adventure);
			})
		} else {
			interaction.update({ content: `There aren't any more ${name} to take.`, components: [] });
		}
	}
);
