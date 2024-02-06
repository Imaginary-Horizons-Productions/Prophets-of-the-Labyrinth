const { SelectWrapper, Challenge } = require('../classes');
const { getChallenge } = require('../challenges/_challengeDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { renderRoom } = require('../util/embedUtil');

const mainId = "challenge";
module.exports = new SelectWrapper(mainId, 3000,
	/** Apply the selected challenge to the adventure */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		interaction.update(EMPTY_MESSAGE_PAYLOAD);
		if (adventure?.room.hasResource("roomAction")) {
			const [challengeName] = interaction.values;
			const { intensity, duration, reward } = getChallenge(challengeName);
			if (adventure.challenges[challengeName]) {
				adventure.challenges[challengeName].intensity += intensity;
				adventure.challenges[challengeName].duration += duration;
				adventure.challenges[challengeName].reward += reward;
			} else {
				adventure.challenges[challengeName] = new Challenge(intensity, reward, duration);
			}
			adventure.room.decrementResource("roomAction", 1);
			adventure.room.history["New challenges"].push(challengeName);
			interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
				roomMessage.edit(renderRoom(adventure, interaction.channel));
			})
			interaction.channel.send({ content: `The party takes on a new challenge: ${challengeName}` });
			setAdventure(adventure);
		}
	}
);
