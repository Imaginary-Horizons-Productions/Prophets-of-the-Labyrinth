const { SelectWrapper } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { buildGearRecord } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');

const mainId = "blackboxgear";
module.exports = new SelectWrapper(mainId, 3000,
	/** Remove selected gear, give black box gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const blackBoxResource = Object.values(adventure.room.resources).find(resource => resource.type === "gear");
		if (blackBoxResource.count < 1) {
			interaction.reply({ content: "The black box has already been opened.", ephemeral: true });
			return;
		}

		const gearIndex = interaction.values[0];
		delete adventure.room.resources[blackBoxResource.name];
		const tradedGearName = delver.gear[gearIndex].name;
		adventure.room.history["Traded for box"].push(tradedGearName);
		delver.gear.splice(gearIndex, 1, buildGearRecord(blackBoxResource.name, "max"));
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			roomMessage.edit(renderRoom(adventure, interaction.channel));
		})
		setAdventure(adventure);
		interaction.update(EMPTY_MESSAGE_PAYLOAD);
		interaction.channel.send(`**${interaction.user.displayName}** trades their **${tradedGearName}** for the **${blackBoxResource.name}** in the black box.`);
	}
);
