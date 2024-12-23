const { ArchetypeTemplate, BuildError } = require("../classes");

/** @type {Record<string, ArchetypeTemplate>} */
const ARCHETYPES = {};

for (const file of [
	"assassin.js",
	"beasttamer.js",
	"chemist.js",
	"detective.js",
	"fighter.js",
	"hemomancer.js",
	"knight.js",
	"legionnaire.js",
	"martialartist.js",
	"ritualist.js"
]) {
	/** @type {ArchetypeTemplate} */
	const archetype = require(`./${file}`);
	if (archetype.name in ARCHETYPES) {
		throw new BuildError(`Duplicate archetype name (${archetype.name})`);
	}
	ARCHETYPES[archetype.name] = archetype;
}

/** @param {string} archetypeName */
function getArchetype(archetypeName) {
	return ARCHETYPES[archetypeName];
}

function getArchetypesCount() {
	return Object.keys(ARCHETYPES).length;
}

module.exports = {
	getArchetype,
	getArchetypesCount
};
