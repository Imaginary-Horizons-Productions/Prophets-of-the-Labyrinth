const { ArtifactTemplate, Adventure } = require("../classes");

/** @type {Record<string, ArtifactTemplate>} */
const ARTIFACTS = {};
const ARTIFACT_NAMES = [];

/** @type {{"Earth": ArtifactTemplate[], "Wind": ArtifactTemplate[], "Water": ArtifactTemplate[], "Fire": ArtifactTemplate[], "Unaligned": ArtifactTemplate[]}} */
const ROLL_TABLE = {
	Darkness: [],
	Earth: [],
	Fire: [],
	Light: [],
	Wind: [],
	Water: [],
	Unaligned: []
}

for (const file of [
	"addblocker.js",
	"amethystspyglass.js",
	"bejeweledtreasuresphere.js",
	"bestinclasshammer.js",
	"boatparts.js",
	"celestialknightinsignia.js",
	"crystalshard.js",
	"enchantedmap.js",
	"hammerspaceholster.js",
	"hawktailfeather.js",
	"healthinsuranceloophole.js",
	"loadeddice.js",
	"manualmanual.js",
	"negativeoneleafclover.js",
	"oilpainting.js",
	"peacockcharm.js",
	"phoenixfruitblossom.js",
	"piggybank.js",
	"spiralfunnel.js",
	"weaponpolish.js"
]) {
	/** @type {ArtifactTemplate} */
	const artifact = require(`./${file}`);
	ARTIFACTS[artifact.name.toLowerCase()] = artifact;
	ARTIFACT_NAMES.push(artifact.name);
	ROLL_TABLE[artifact.essence].push(artifact.name);
}

/** @param {string} artifactName */
function getArtifact(artifactName) {
	return ARTIFACTS[artifactName.toLowerCase()];
}

function getArtifactCounts() {
	return Object.values(ARTIFACTS).length;
}

/** @param {Adventure} adventure */
function rollArtifact(adventure) {
	/** @type {string[]} */
	const artifactPool = adventure.getPartyEssences().reduce((artifacts, essence) => artifacts.concat(ROLL_TABLE[essence]), []);
	return artifactPool[adventure.generateRandomNumber(artifactPool.length, "general")];
}

/**
 * @param {Adventure} adventure
 * @param {string[]} exclusions
 */
function rollArtifactWithExclusions(adventure, exclusions = []) {
	/** @type {string[]} */
	const artifactPool = adventure.getPartyEssences().reduce((artifacts, essence) => artifacts.concat(ROLL_TABLE[essence]), []).filter(artifact => !exclusions.includes(artifact));
	if (artifactPool.length > 0) {
		return artifactPool[adventure.generateRandomNumber(artifactPool.length, "general")];
	} else {
		return null;
	}
}

module.exports = {
	artifactNames: ARTIFACT_NAMES,
	getArtifact,
	getArtifactCounts,
	rollArtifact,
	rollArtifactWithExclusions
};
