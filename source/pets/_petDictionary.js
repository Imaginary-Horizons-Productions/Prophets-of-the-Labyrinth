const { BuildError, PetTemplate, PetMoveTemplate, Adventure, CombatantReference } = require("../classes");
const { getApplicationEmojiMarkdown } = require("../util/graphicsUtil");

/** @type {Record<string, PetTemplate>} */
const PETS = {};
const PET_NAMES = [];

for (const file of [
	"friendlyslime.js",
	"redtailedraptor.js",
	"shieldgoblin.js",
	"shinystone.js"
]) {
	/** @type {PetTemplate} */
	const pet = require(`./${file}`);
	if (pet.name.toLowerCase() in PETS) {
		throw new BuildError(`Duplicate enemy name (${pet.name})`)
	}
	PETS[pet.name.toLowerCase()] = pet;
	PET_NAMES.push(pet.name);
}

/** @param {string} petName */
function getPetTemplate(petName) {
	return PETS[petName.toLowerCase()];
}

/**
 * @param {{ petName: string, level: number }} petRecord
 * @param {number} index
 */
function getPetMoveDescription({ type: petName, level }, index) {
	const move = getPetMove({ type: petName, level }, index);
	if (move.modifiers) {
		let description = move.description;
		move.modifiers.forEach((modifier, index) => {
			description = description.replace(new RegExp(`@{mod${index}}`, "g"), getApplicationEmojiMarkdown(modifier.name))
				.replace(new RegExp(`@{mod${index}Stacks}`, "g"), modifier.stacks);
		})
		return [move.name, description];
	} else {
		return [move.name, move.description];
	}
}

/**
 * @param {{ type: string, level: number }} petRecord
 * @param {number} moveIndex
 */
function getPetMove({ type: petName, level }, moveIndex) {
	if (moveIndex === 1 && level === 1) {
		return new PetMoveTemplate("Loaf Around", "The pet loafs around", () => [], (targets, owner, adventure) => {
			const descriptions = [
				`${owner.name}'s ${petName} loafs around.`,
				`${owner.name}'s ${petName} is doing a rock impression.`,
				`${owner.name}'s ${petName} does a little hop.`,
				`${owner.name}'s ${petName} loafs around.`,
				`${owner.name}'s ${petName} decided to take a nap.`,
				`${owner.name}'s ${petName} demands additional lumber.`,
				`${owner.name}'s ${petName} is (now) on cooldown.`
			];
			return [descriptions[Date.now() % descriptions.length]];
		})
	}
	return PETS[petName.toLowerCase()].moves[moveIndex][Math.ceil((level - moveIndex) / 2) - 1];
}

/**
 * @param {number} count
 * @param {boolean} allowDupes
 */
function rollPets(count, allowDupes) {
	/** @type {string[]} */
	const results = [];
	const pool = [...PET_NAMES];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(pool.length * Math.random());
		if (allowDupes) {
			const archetype = pool[randomIndex];
			if (!results.includes(archetype)) {
				results.push(archetype);
			}
		} else {
			results.push(...pool.splice(randomIndex, 1));
		}
	}
	return results;
}

/** @param {Adventure} adventure */
function generatePetRNs(adventure) {
	const owner = adventure.delvers[adventure.petRNs.delverIndex];
	if (owner.pet.type !== "") {
		adventure.petRNs.moveIndex = adventure.generateRandomNumber(2, "general");
		adventure.petRNs.targetReferences = [];
		adventure.petRNs.extras = [];
		const moveTemplate = getPetMove(owner.pet, adventure.petRNs.moveIndex);
		if (moveTemplate.rnConfig) {
			moveTemplate.rnConfig.forEach(rnType => {
				switch (rnType) {
					case "enemyIndex":
						const livingEnemyIndices = [];
						for (let i = 0; i < adventure.room.enemies.length; i++) {
							if (adventure.room.enemies[i].hp > 0) {
								livingEnemyIndices.push(i);
							}
						}
						adventure.petRNs.targetReferences.push(new CombatantReference(owner.team === "delver" ? "enemy" : "delver", livingEnemyIndices[adventure.generateRandomNumber(livingEnemyIndices.length, "general")]));
						break;
					default:
						adventure.petRNs.extras.push(adventure.generateRandomNumber(rnType, "general"));
				}
			})
		}
	}
}

module.exports = {
	PET_NAMES,
	getPetTemplate,
	getPetMoveDescription,
	getPetMove,
	rollPets,
	generatePetRNs
}
