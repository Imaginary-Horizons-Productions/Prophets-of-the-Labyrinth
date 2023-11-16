const { SelectWrapper, Gear } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { editButtons, consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "randomupgrade";
module.exports = new SelectWrapper(mainId, 3000,
	/** Randomly select an upgrade for a given piece of gear */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (adventure.room.resources.roomAction.count < 1) {
			interaction.reply({ content: "The forge's supplies have been exhausted.", ephemeral: true });
			return;
		}

		const user = adventure.delvers.find(delver => delver.id === interaction.user.id);
		const [gearName, index] = interaction.values[0].split(SAFE_DELIMITER);
		/** @type {string[]} */
		const upgradePool = getGearProperty(gearName, "upgrades").concat(getGearProperty(gearName, "sidegrades"));
		const upgradeName = upgradePool[adventure.generateRandomNumber(upgradePool.length, "general")];
		const upgradeDurability = getGearProperty(upgradeName, "maxDurability");
		const durabilityDifference = upgradeDurability - getGearProperty(gearName, "maxDurability");
		if (durabilityDifference > 0) {
			user.gear[index].durability += durabilityDifference;
		}
		user.gear.splice(index, 1, new Gear(upgradeName, Math.min(upgradeDurability, user.gear[index].durability), getGearProperty(gearName, "maxHP"), getGearProperty(gearName, "speed"), getGearProperty(gearName, "critRate"), getGearProperty(gearName, "poise")));
		interaction.channel.messages.fetch(adventure.messageIds.room).then(roomMessage => {
			const { embeds, remainingActions } = consumeRoomActions(adventure, roomMessage.embeds, 1);
			let components = roomMessage.components;
			if (remainingActions < 1) {
				components = editButtons(components, {
					"upgrade": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" },
					"viewrepairs": { preventUse: true, label: "Forge supplies exhausted", emoji: "✔️" }
				})
			}
			return roomMessage.edit({ embeds, components });
		}).then(() => {
			interaction.update({ components: [] });
			interaction.channel.send(`${interaction.user}'s *${gearName}* has been upgraded to **${upgradeName}**!`);
			setAdventure(adventure);
		})
	}
);
