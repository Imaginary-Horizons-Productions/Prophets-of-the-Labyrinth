const { Scaling } = require("../../classes");

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
};
