/** Remove components (buttons and selects) from a given message
 * @param {string} messageId - the id of the message to remove components from
 * @param {MessageManager} messageManager - the MessageManager for the channel the message is in
 */
function clearComponents(messageId, messageManager) {
	if (messageId) {
		messageManager.fetch(messageId).then(message => {
			message.edit({ components: [] });
		})
	}
};

module.exports = {
	clearComponents
};
