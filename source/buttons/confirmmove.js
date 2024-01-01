const { ButtonWrapper, CombatantReference, Move } = require('../classes');
const { SAFE_DELIMITER, EMPTY_MESSAGE_PAYLOAD } = require('../constants');
const { getGearProperty } = require('../gear/_gearDictionary');
const { getAdventure, checkNextRound, endRound, setAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "confirmmove";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Add move object to adventure */
	async (interaction, [moveName, round, index]) => {
		const adventure = getAdventure(interaction.channelId);
		const user = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!(user?.gear.some(gear => gear.name === moveName && gear.durability > 0))) {
			interaction.update({ content: `You don't have a ${moveName} with remaining durability.`, embeds: [], components: [] })
				.catch(console.error);
			return;
		} else {
			interaction.update(EMPTY_MESSAGE_PAYLOAD);
		}

		if (adventure?.room.round !== Number(round)) {
			return;
		}

		// Add move to round list (overwrite exisiting readied move)
		const userIndex = adventure.getCombatantIndex(user);
		const newMove = new Move(new CombatantReference(user.team, userIndex), "gear", user.crit)
			.setName(moveName)
			.setSpeedByCombatant(user)
			.setPriority(getGearProperty(moveName, "priority") ?? 0);

		let targetText = "";
		const { target, team } = getGearProperty(moveName, "targetingTags");
		if (target === "all") {
			let targetCount = 0;
			if (team === "ally") {
				targetCount = adventure.delvers.length;
				targetText = "all allies";
			} else if (team === "foe") {
				targetCount = adventure.room.enemies.length;
				targetText = "all enemies";
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(new CombatantReference(team === "ally" ? "delver" : "enemy", i));
			}
		} else if (target.startsWith("random")) {
			const targetCount = Number(target.split(SAFE_DELIMITER)[1]);
			let poolSize = 0;
			if (team === "ally") {
				poolSize = adventure.delvers.length;
				targetText = `${targetCount} random all${targetCount === 1 ? "y" : "ies"}`;
			} else if (team === "foe") {
				poolSize = adventure.room.enemies.length;
				targetText = `${targetCount} random enem${targetCount === 1 ? "y" : "ies"}`;
			}
			for (let i = 0; i < targetCount; i++) {
				newMove.addTarget(new CombatantReference(team === "ally" ? "delver" : "enemy", adventure.generateRandomNumber(poolSize, "battle")));
			}
		} else if (target === "self") {
			newMove.addTarget(new CombatantReference("delver", userIndex));
		} else if (target === "none") {
			newMove.addTarget(new CombatantReference("none", -1));
		}

		let overwritten = false;
		for (let i = 0; i < adventure.room.moves.length; i++) {
			const { userReference } = adventure.room.moves[i];
			if (userReference.team === user.team && userReference.index === userIndex) {
				await adventure.room.moves.splice(i, 1);
				overwritten = true;
				break;
			}
		}
		await adventure.room.moves.push(newMove);

		// Send confirmation text
		interaction.channel.send(`${interaction.user} ${overwritten ? "switches to ready" : "readies"} **${moveName}**${target !== "none" && target !== "self" ? ` to use on **${targetText}**` : ""}.`).then(() => {
			setAdventure(adventure);
			if (checkNextRound(adventure)) {
				endRound(adventure, interaction.channel);
			};
		}).catch(console.error);
	}
);
