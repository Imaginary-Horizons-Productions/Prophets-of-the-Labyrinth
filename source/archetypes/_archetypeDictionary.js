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

function getArchetypesCount() {
	return Object.keys(ARCHETYPES).length;
}

module.exports = {
	getAllArchetypeNames,
	getArchetype,
	getArchetypeActionName,
	getArchetypesCount
};
