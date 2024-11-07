const { BuildError, PetTemplate, PetMoveTemplate, Adventure } = require("../classes");
const { getPlayer } = require("../orcustrators/playerOrcustrator");

/** @type {Record<string, PetTemplate>} */
const PETS = {};
const PET_NAMES = [];

for (const file of [
	"friendlyslime.js"
]) {
	/** @type {PetTemplate} */
	const pet = require(`./${file}`);
	if (pet.name.toLowerCase() in PETS) {
		throw new BuildError(`Duplicate enemy name (${pet.name})`)
	}
	PETS[pet.name.toLowerCase()] = pet;
	PET_NAMES.push(pet.name);
}

function getPetMoveDescription(petName, index, level) {
	//TODONOW finish
}

/** @param {Adventure} adventure */
function generatePetRNs(adventure) {
	const owner = adventure.delvers[adventure.nextPet];
	if (owner.pet !== "") {
		adventure.petRNs = [adventure.generateRandomNumber(2, "general")];
		const moveTemplate = getPetMove(owner.pet, adventure.petRNs, owner.id, adventure.guildId);
		if (moveTemplate.rnConfig) {
			moveTemplate.rnConfig.forEach(rnType => {
				switch (rnType) {
					case "enemyIndex":
						const livingEnemyIndicies = [];
						for (let i = 0; i < adventure.room.enemies.length; i++) {
							if (adventure.room.enemies[i].hp > 0) {
								livingEnemyIndicies.push(i);
							}
						}
						adventure.petRNs.push(livingEnemyIndicies[adventure.generateRandomNumber(livingEnemyIndicies.length, "general")]);
						break;
					default:
						adventure.petRNs.push(adventure.generateRandomNumber(rnType, "general"));
				}
			})
		}

	}
}

/**
 * @param {string} petName
 * @param {[number]} petRNs
 * @param {string} playerId
 * @param {string} guildId
 */
function getPetMove(petName, [moveIndex], playerId, guildId) {
	const player = getPlayer(playerId, guildId);
	const petLevel = player.pets[petName];
	if (moveIndex === 1 && petLevel === 1) {
		return new PetMoveTemplate("Loaf Around", "The pet loafs around", () => [], (targets, owner, adventure) => {
			return [`${owner.name}'s ${petName} loafs around.`];
		})
	}
	return PETS[petName.toLowerCase()].moves[moveIndex][Math.ceil((petLevel - moveIndex) / 2)];
}

module.exports = {
	PET_NAMES,
	getPetMove,
	generatePetRNs
}
