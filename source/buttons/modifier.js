const { EmbedBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { modifiersToString } = require('../util/combatantUtil');
const { isBuff, isDebuff, getModifierDescription, isNonStacking } = require('../modifiers/_modifierDictionary');

const mainId = "modifier";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Provide details about the given modifier */
	(interaction, [modifierName]) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure) {
			interaction.reply({ content: "This adventure is no longer active.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (modifierName !== "MORE") {
			const buff = isBuff(modifierName);
			const debuff = isDebuff(modifierName);
			let styleColor;
			if (buff) {
				styleColor = "5865f2";
			} else if (debuff) {
				styleColor = "ed4245";
			} else {
				styleColor = "4f545c";
			}
			const embed = new EmbedBuilder().setColor(styleColor)
				.setTitle(`${modifierName}${isNonStacking(modifierName) ? "" : ` x ${delver.modifiers[modifierName]}`}`)
				.setDescription(getModifierDescription(modifierName, delver, adventure))
				.addFields({ name: "Category", value: `${buff ? "Buff" : debuff ? "Debuff" : "Modifier"}` });
			interaction.reply({ embeds: [embed], ephemeral: true });
		} else {
			const embed = new EmbedBuilder().setColor("4f545c")
				.setTitle("All Modifiers")
				.setDescription(modifiersToString(delver, true, adventure))
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	}
);
