const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, changeStagger, getNames } = require("../util/combatantUtil.js");
const { selectRandomFoe, selectAllCombatants } = require("../shared/actionComponents.js");
const { getEmoji } = require("../util/elementUtil.js");

const PATTERN = {
  "Fragment": "random", // can keep fragmenting before randomly exploding on a coin flip
  "Bolide Burst": "random"
}
function asteroidPattern(actionName) {
  return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Asteroid",
  "Earth",
  85,
  10,
  "2",
  0,
  "Fragment",
  false
).addAction({
  name: "Fragment",
  element: "Earth",
  description: `Inflict ${getEmoji("Earth")} damage to delver, and loses some health`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() + 30;
    const recoilDmg = 20;
    if (isCrit) {
      damage *= 2;
    }
    changeStagger(targets, "elementMatchFoe");
    return `${dealDamage(targets, user, damage, false, user.element, adventure)} ${dealDamage([user], user, recoilDmg, true, "Untyped", adventure)}`;
  },
  selector: selectRandomFoe,
  needsLivingTargets: true,
  next: asteroidPattern
}).addAction({
  name: "Bolide Burst",
  element: "Earth",
  description: `Sacrifice self to attack all combatants with ${getEmoji("Earth")} damage equal to its remaining hp`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() + user.hp;
    if (isCrit) {
      damage *= 2;
    }
    user.hp = 0;
    changeStagger(targets, "elementMatchFoe");
    return `${dealDamage(targets, user, damage, false, user.element, adventure)} ${getNames([user], adventure)[0]} is downed.`;
  },
  selector: selectAllCombatants,
  needsLivingTargets: true,
  next: asteroidPattern
});
