const { ArchetypeTemplate, BuildError } = require("../classes");

/** @type {Record<string, ArchetypeTemplate>} */
const ARCHETYPES = {};

for (const file of [
	"adventurer.js",
	"beasttamer.js",
	"chemist.js",
	"knight.js",
	"martialartist.js",
	"ritualist.js",
	"rogue.js",
	"tactician.js",
	"trickster.js"
]) {
	/** @type {ArchetypeTemplate} */
	const archetype = require(`./${file}`);
	if (archetype.name in ARCHETYPES) {
		throw new BuildError(`Duplicate archetype name (${archetype.name})`);
	}
	ARCHETYPES[archetype.name] = archetype;
}

function getAllArchetypeNames() {
	return Object.keys(ARCHETYPES);
}

/** @param {string} archetypeName */
function getArchetype(archetypeName) {
	return ARCHETYPES[archetypeName];
}

/**
 * @param {string} archetype
 * @param {string} specialzation
 */
function getArchetypeActionName(archetype, specialzation) {
	return ARCHETYPES[archetype].archetypeActions[specialzation];
}

/**
 * @param {number} count
 * @param {boolean} allowDupes
 */
function rollArchetypes(count, allowDupes) {
	/** @type {string[]} */
	const results = [];
	const pool = Object.keys(ARCHETYPES);
	for (let i = 0; i < count; i++) {
		//TODONOW more secure RNG
		const randomIndex = Math.floor(pool.length * Math.random());
		if (allowDupes) {
			const archetype = pool[randomIndex];
			if (!results.includes(archetype)) {
				results.push(archetype);
			}
		} else {
			results.push(pool.splice(randomIndex, 1)[0]);
		}
	}
	return results;
}

function getArchetypesCount() {
	return Object.keys(ARCHETYPES).length;
}

module.exports = {
	getAllArchetypeNames,
	getArchetype,
	getArchetypeActionName,
	rollArchetypes,
	getArchetypesCount
};
