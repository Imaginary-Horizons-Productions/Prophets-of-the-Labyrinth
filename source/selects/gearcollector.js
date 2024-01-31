const { SelectWrapper } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { consumeRoomActions, editButtons } = require('../util/messageComponentUtil');

const mainId = "gearcollector";
module.exports = new SelectWrapper(mainId, 3000,
	/** Consume room action and gear, gain gold */
	(interaction, [pricePercent]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The Gear Collector is out of time for trades today.", ephemeral: true });
			return;
		}

		const [saleIndex] = interaction.values;
		const gearName = delver.gear[saleIndex].name;
		let price = pricePercent / 100 * getGearProperty(gearName, "cost");
		delver.gear.splice(saleIndex, 1);
		adventure.gainGold(price);
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			return updateRoomHeader(adventure, roomMessage);
		}).then(updatedRoomMessage => {
			const { embeds, remainingActions } = consumeRoomActions(adventure, updatedRoomMessage.embeds, 1);
			let components = updatedRoomMessage.components;
			if (remainingActions < 1) {
				components = editButtons(components, {
					"viewgearcollector": { preventUse: true, label: "Gear traded", emoji: "✔️" }
				});
			}
			updatedRoomMessage.edit({ embeds, components });
			setAdventure(adventure);
			interaction.update(EMPTY_MESSAGE_PAYLOAD);
			interaction.channel.send(`**${interaction.member.displayName}** sells their ${gearName} for ${price}g.`);
		})
	}
);
