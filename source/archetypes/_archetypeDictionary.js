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

/**
 * @param {number} count
 * @param {boolean} allowDupes
 */
function rollArchetypes(count, allowDupes) {
	/** @type {string[]} */
	const results = [];
	const pool = Object.keys(ARCHETYPES);
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(pool.length * Math.random());
		if (allowDupes) {
			const archetype = pool[randomIndex];
			if (!results.includes(archetype)) {
				results.push(archetype);
			}
		} else {
			results.push(pool.splice(randomIndex, 1));
		}
	}
	return results;
}

function getArchetypesCount() {
	return Object.keys(ARCHETYPES).length;
}

module.exports = {
	getArchetype,
	rollArchetypes,
	getArchetypesCount
};
