const { EmbedBuilder, Colors } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { modifiersToString } = require('../util/combatantUtil');
const { randomAuthorTip } = require('../util/embedUtil');
const { isBuff, isDebuff, getModifierDescription, getModifierEmoji } = require('../modifiers/_modifierDictionary');

const mainId = "modifier";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Provide details about the given modifier */
	(interaction, [modifierName]) => {
		const adventure = getAdventure(interaction.channelId);
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
				styleColor = Colors.Blurple;
			} else if (debuff) {
				styleColor = Colors.Red;
			} else {
				styleColor = Colors.LightGrey;
			}
			interaction.reply({
				embeds: [
					new EmbedBuilder().setColor(styleColor)
						.setAuthor(randomAuthorTip())
						.setTitle(`${modifierName} x ${delver.modifiers[modifierName]} ${getModifierEmoji(modifierName)}`)
						.setDescription(getModifierDescription(modifierName, delver, adventure))
						.addFields({ name: "Category", value: `${buff ? "Buff" : debuff ? "Debuff" : "Modifier"}` })
				], ephemeral: true
			});
		} else {
			interaction.reply({
				embeds: [
					new EmbedBuilder().setColor(Colors.LightGrey)
						.setAuthor(randomAuthorTip())
						.setTitle("All Modifiers")
						.setDescription(modifiersToString(delver, adventure))
				],
				ephemeral: true
			});
		}
	}
);
