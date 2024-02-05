const { ButtonWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { transformGear } = require('../util/delverUtil');
const { renderRoom } = require('../util/embedUtil');

const mainId = "repairkittinker";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Upgrade a delver's random gear piece to a random upgrade */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		/** @type {[string, string[]][]} */
		const eligibleGear = [];
		delver.gear.forEach(gear => {
			const upgrades = getGearProperty(gear.name, "upgrades");
			eligibleGear.push([gear.name, upgrades ?? []]);
		});

		if (eligibleGear.every(([gearName, upgrades]) => upgrades.length < 1)) {
			interaction.reply({ content: "None of your gear can be upgraded.", ephemeral: true });
			return;
		}

		if (adventure.room.resources["Repair Kit"].count > 0) {
			adventure.room.decrementResource("Repair Kit", "all");
			const gearIndex = adventure.generateRandomNumber(eligibleGear.length, "general");
			const [gearToUpgrade, upgradePool] = eligibleGear[gearIndex];
			const upgradeName = upgradePool[adventure.generateRandomNumber(upgradePool.length, "general")];
			adventure.room.addResource(`${delver.name}: ${upgradeName}`, "history", "internal", 1);
			transformGear(delver, gearIndex, gearToUpgrade, upgradeName);
			interaction.update(renderRoom(adventure, interaction.message.channel)).then(() => {
				setAdventure(adventure);
			});
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
