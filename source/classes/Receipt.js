const { areSetContentsCongruent } = require("../util/mathUtil");

class Receipt {
	/** A receipt is a runtime object representing either beneficial or harmful changes (damage or healing, modifiers, and/or stagger) to one or multiple (if changes match) combatants due to a single move
	 * @param {string[]} combatantNamesArray
	 * @param {"." | "!"} endPunctuation
	 * @param {object} changes
	 * @param {[string | null, number][]} changes.damagesArray
	 * @param {number} changes.damageCapApplied
	 * @param {number} changes.blockedDamage
	 * @param {[string | null, number]} changes.healingsArray
	 * @param {string[]} changes.addedModifierEmojiArray
	 * @param {string[]} changes.removedModifierEmojiArray
	 * @param {"add" | "remove" | null} changes.bonusStagger
	 */
	constructor(combatantNamesArray, endPunctuation, { damagesArray, damageCapApplied, blockedDamage, healingsArray, addedModifierEmojiArray, removedModifierEmojiArray, bonusStagger }) {
		this.combatantNames = new Set(combatantNamesArray);
		this.excitement = endPunctuation;
		/** @type {Map<string | null, number>} key for damage essence or modifier emoji (`null` for Unaligned's special properities), value for magnitude */
		this.damageMap = damagesArray ? new Map(damagesArray) : new Map();
		this.damageCapApplied = damageCapApplied || null;
		this.blockedDamage = blockedDamage || 0;
		this.healingMap = healingsArray ? new Map(healingsArray) : new Map();
		this.addedModifiers = addedModifierEmojiArray ? new Set(addedModifierEmojiArray) : new Set();
		this.removedModifiers = removedModifierEmojiArray ? new Set(removedModifierEmojiArray) : new Set();
		this.stagger = bonusStagger || null;
	}

	/** @param {Receipt} incomingReceipt */
	combineCombatantNames(incomingReceipt) {
		for (const name of incomingReceipt.combatantNames) {
			this.combatantNames.add(name);
		}
	}

	/** @param {Receipt} incomingReceipt */
	combineChanges(incomingReceipt) {
		// End Punctuation
		if (this.excitement === "." && incomingReceipt.excitement === "!") {
			this.excitement = "!";
		}

		// Damage
		for (const [type, magnitude] of incomingReceipt.damageMap) {
			if (type in this.damageMap) {
				this.damageMap[type] += magnitude;
			} else {
				this.damageMap[type] = magnitude;
			}
		}

		// Damage Cap Applied
		if (incomingReceipt.damageCapApplied !== null) {
			if (this.damageCapApplied !== null) {
				this.damageCapApplied = Math.min(this.damageCapApplied, incomingReceipt.damageCapApplied);
			} else {
				this.damageCapApplied = incomingReceipt.damageCapApplied;
			}
		}

		// Blocked Damage
		this.blockedDamage += incomingReceipt.blockedDamage;

		// Healing
		for (const [source, magnitude] of incomingReceipt.healingMap) {
			if (source in this.healingMap) {
				this.healingMap[source] += magnitude;
			} else {
				this.healingMap[source] = magnitude;
			}
		}

		// Modifiers
		for (const modifier of incomingReceipt.addedModifiers) {
			this.addedModifiers.add(modifier);
		}
		for (const modifier of incomingReceipt.removedModifiers) {
			this.removedModifiers.add(modifier);
		}

		// Stagger
		if (this.stagger === null && incomingReceipt.stagger !== null) {
			this.stagger = incomingReceipt.stagger;
		}
	}

	/**
	 * @param {Receipt} receipt1
	 * @param {Receipt} receipt2
	 */
	static congruenceCheck(receipt1, receipt2) {
		// Excitement - fully derived from other changes, so no need to check

		// Damage Cap Applied
		if (receipt1.damageCapApplied !== receipt2.damageCapApplied) {
			return false;
		}

		// Blocked Damage
		if (receipt1.blockedDamage !== receipt2.blockedDamage) {
			return false;
		}

		// Stagger
		if (receipt1.stagger !== receipt2.stagger) {
			return false;
		}

		// Damage
		if (receipt1.damageMap.size !== receipt2.damageMap.size) {
			return false;
		}
		for (const essence in receipt1.damageMap) {
			if (!(essence in receipt2.damageMap)) {
				return false;
			}
		}

		// Healing
		if (receipt1.healingMap.size !== receipt2.healingMap.size) {
			return false;
		}
		for (const source in receipt1.healingMap) {
			if (!(source in receipt2.healingMap)) {
				return false;
			}
		}

		// Modifiers
		return areSetContentsCongruent(receipt1.addedModifiers, receipt2.addedModifiers) && areSetContentsCongruent(receipt1.removedModifiers, receipt2.removedModifiers);
	}
}

module.exports = {
	Receipt
};
