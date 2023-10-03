const { ButtonWrapper } = require('../classes');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "replacegear";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Replace the delver's gear at the given index with the given gear */
	(interaction, [name, index, atTreasure]) => {
		const adventure = getAdventure(interaction.channel.id);
		const { count, cost } = adventure.room.resources[name];
		if (count > 0) {
			const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
			const discardedName = delver.gear[index].name;
			delver.gear.splice(index, 1, { name, uses: getGearProperty(name, "maxUses") });
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				adventure.room.resources[name].count--;
				adventure.gold -= cost;
				if (Boolean(atTreasure)) {
					adventure.room.resources.roomAction.count--;
				}
				return roomMessage.edit(renderRoom(adventure, interaction.channel));
			}).then(() => {
				interaction.update({ components: [] });
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
