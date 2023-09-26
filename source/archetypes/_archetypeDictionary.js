const { Archetype, BuildError } = require("../classes");

/** @type {Record<string, Archetype>} */
const ARCHETYPES = {};

for (const file of [
	// "assassin.js",
	// "chemist.js",
	// "hemomancer.js",
	"knight.js",
	// "legionnaire.js",
	"martialartist.js",
	// "ritualist.js"
]) {
	const archetype = require(`./${file}`);
	if (archetype.name in ARCHETYPES) {
		throw new BuildError(`Duplicate archetype name (${archetype.name})`);
	}
	ARCHETYPES[archetype.name] = archetype;
}

/** @param {string} archetypeName */
exports.getArchetype = function (archetypeName) {
	return ARCHETYPES[archetypeName];
}
