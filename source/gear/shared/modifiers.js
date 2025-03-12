const { Scaling } = require("../../classes");
const { SAFE_DELIMITER } = require("../../constants");

module.exports = {
	/** @type {(baseStacks: number) => ({ name: "Distraction", stacks: Scaling })} */
	scalingDistraction: (baseStacks) => ({ name: "Distraction", stacks: { description: `${baseStacks} + 10% Bonus HP`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 10) } }),
	/** @type {(baseStacks: number) => ({ name: "Empowerment", stacks: Scaling })} */
	scalingEmpowerment: (baseStacks) => ({ name: "Empowerment", stacks: { description: `${baseStacks} + Bonus Speed`, calculate: (user) => baseStacks + user.getBonusSpeed() } }),
	/** @type {(baseStacks: number) => ({ name: "Evasion", stacks: Scaling })} */
	scalingEvasion: (baseStacks) => ({ name: "Evasion", stacks: { description: `${baseStacks} + 2% Bonus HP`, calculate: (user) => baseStacks + Math.floor(user.getBonusHP() / 50) } }),
	/** @type {(baseStacks: number) => ({ name: "Excellence", stacks: Scaling })} */
	scalingExcellence: (baseStacks) => ({ name: "Excellence", stacks: { description: `${baseStacks} + 10% Bonus Speed`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 10) } }),
	/** @type {(baseStacks: number) => ({ name: "Exposure", stacks: Scaling })} */
	scalingExposure: (baseStacks) => ({ name: "Exposure", stacks: { description: `${baseStacks} + 10% Bonus Speed`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 10) } }),
	/** @type {(baseStacks: number) => ({ name: "Impotence", stacks: Scaling })} */
	scalingImpotence: (baseStacks) => ({ name: "Impotence", stacks: { description: `${baseStacks} + 10% Bonus Speed`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 10) } }),
	/** @type {(baseStacks: number) => ({ name: "Regeneration", stacks: Scaling })} */
	scalingRegeneration: (baseStacks) => ({ name: "Regeneration", stacks: { description: `${baseStacks} + 5% Bonus Speed`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 20) } }),
	/** @type {(baseStacks: number) => ({ name: "Swiftness", stacks: Scaling })} */
	scalingSwiftness: (baseStacks) => ({ name: "Swiftness", stacks: { description: `${baseStacks} + 10% Bonus Speed`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 10) } }),
	/** @type {(baseStacks: number) => ({ name: "Torpidity", stacks: Scaling })} */
	scalingTorpidity: (baseStacks) => ({ name: "Torpidity", stacks: { description: `${baseStacks} + 10% Bonus Speed`, calculate: (user) => baseStacks + Math.floor(user.getBonusSpeed() / 10) } }),
	/** @type {(variantName: string) => ({ name: "Misfortune", stacks: Scaling })} */
	deckOfCardsMisfortune: (variantName) => ({
		name: "Misfortune", stacks: {
			description: "a random amount between 2 and 6", calculate: (user) => {
				if (`${variantName}${SAFE_DELIMITER}Deck of Cards` in user.roundRns) {
					return 2 + user.roundRns[`${variantName}${SAFE_DELIMITER}Deck of Cards`][0];
				} else {
					return "a random amount between 2 and 6";
				}
			}
		}
	}),
	/** @type {(variantName: string) => ({ name: "Empowerment", stacks: Scaling })} */
	tempestuousWrathEmpowerment: () => ({
		name: "Empowerment",
		stacks: {
			description: "25 x (1 to 1.5 based on missing HP)",
			calculate: (user) => {
				const furiousness = 1.5 - (user.hp / user.getMaxHP() / 2);
				return 25 * furiousness;
			}
		}
	}),
};
