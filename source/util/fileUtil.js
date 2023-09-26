const fs = require("fs");

/** @type {{paid: string[], gift: string[]}} */
const sponsors = require("./config/sponsors.json");

/** Check if the given `id` belongs to a sponsor of the project
 * @param {string} id
 * @returns {boolean} if the id belongs to a sponsor
 */
function isSponsor(id) {
	let allSponsors = new Set();
	for (const group in sponsors) {
		sponsors[group].forEach(sponsorId => {
			if (!allSponsors.has(sponsorId)) {
				allSponsors.add(sponsorId);
			}
		})
	}
	return allSponsors.has(id);
}

/** Generate parent directories if necessary, and save a file.
 * Keeps a backup of the fileName that may be replaced, until writing succeeds
 * @param {string} dirPath path to the directory of a file
 * @param {string} fileName name of the file to be saved
 * @param {string} data string to be written to the file
 */
async function ensuredPathSave(dirPath, fileName, data) {
	const filePath = dirPath + "/" + fileName;
	const backupFilePath = filePath + ".bak";
	fs.promises.mkdir(dirPath, { recursive: true }) // (idempotently) establish prerequisite directory, in advance
		.then(() => fs.promises.rename(filePath, backupFilePath)) // save previous file as backup
		.catch((err) => err.code === 'ENOENT' ? undefined : Promise.reject(err)) // ignore ENOENT (file not found) for rename if save didn't already exist
		.then(() => fs.promises.writeFile(filePath, data, { encoding: "utf8" })
			.catch((err) => Promise.reject(new Error("writeFile failed", { cause: err })))) // promote errors (including ENOENT) for writeFile)
		.catch(console.error) // log error, and avoid fatally crashing
}

module.exports = {
	isSponsor,
	ensuredPathSave
};
