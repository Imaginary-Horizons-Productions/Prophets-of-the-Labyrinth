const { ArchetypeTemplate, BuildError } = require("../classes");

/** @type {Record<string, ArchetypeTemplate>} */
const ARCHETYPES = {};

for (const file of [
	"assassin.js",
	"chemist.js",
	"detective.js",
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

module.exports = {
	getArchetype
};
