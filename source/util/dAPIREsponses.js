const { DiscordjsErrorCodes } = require("discord.js");

// Discord API Opcodes and Status Codes: https://discord.com/developers/docs/topics/opcodes-and-status-codes

/** Creates a function to pass to a `Promise`'s `.catch` from an array of error kind check functions, often needed to avoid crashes when receiving errors back from external APIs like dAPI
 * @param {((error) => boolean)[]} ignoreThese
 */
function butIgnoreErrorIf(...ignoreThese) {
	return (error) => {
		for (const ignoreThis of ignoreThese) {
			if (ignoreThis(error)) {
				return;
			}
		}
		console.error(error);
	}
}

const isInteractionCollectorError = error => error.code === DiscordjsErrorCodes.InteractionCollectorError;
const isMissingPermissionError = error => error.code === 50013;
const isCantDirectMessageThisUserError = error => error.code === 50007;
const isAutomodError = error => [200000, 200001].includes(error.code);

/** Interaction collectors throw an error on timeout (which is a crash if uncaught) */
const butIgnoreInteractionCollectorErrors = butIgnoreErrorIf(isInteractionCollectorError);

const butIgnoreMissingPermissionErrors = butIgnoreErrorIf(isMissingPermissionError);

const butIgnoreCantDirectMessageThisUserErrors = butIgnoreErrorIf(isCantDirectMessageThisUserError);

module.exports = {
	butIgnoreErrorIf,
	isAutomodError,
	isInteractionCollectorError,
	isMissingPermissionError,
	isCantDirectMessageThisUserError,
	butIgnoreInteractionCollectorErrors,
	butIgnoreMissingPermissionErrors,
	butIgnoreCantDirectMessageThisUserErrors
}
