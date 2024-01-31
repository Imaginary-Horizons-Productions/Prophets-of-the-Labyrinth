const { SelectWrapper } = require('../classes');
const { EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');

const mainId = "sellgear";
module.exports = new SelectWrapper(mainId, 3000,
	/** Consume gear, gain gold */
	(interaction, [pricePercent]) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const [saleIndex] = interaction.values;
		const gearName = delver.gear[saleIndex].name;
		let price = pricePercent / 100 * getGearProperty(gearName, "cost");
		const maxDurability = getGearProperty(gearName, "maxDurability");
		price *= (delver.gear[saleIndex].durability / maxDurability);
		delver.gear.splice(saleIndex, 1);
		adventure.gainGold(price);
		setAdventure(adventure);
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			updateRoomHeader(adventure, roomMessage);
			interaction.update(EMPTY_MESSAGE_PAYLOAD);
			interaction.channel.send(`**${interaction.member.displayName}** sells their ${gearName} for ${price}g.`);
		})
	}
);
