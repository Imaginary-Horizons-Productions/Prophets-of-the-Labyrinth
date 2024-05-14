const { EnemyTemplate } = require("../classes/index.js");
const { dealDamage, removeModifier, changeStagger, getNames } = require("../util/combatantUtil.js");
const { isBuff } = require("../modifiers/_modifierDictionary");
const { selectRandomFoe, selectNone, selectAllFoes } = require("../shared/actionComponents.js");
const { spawnEnemy } = require("../util/roomUtil.js");
const { getEmoji } = require("../util/elementUtil.js");

const asteroid = require("./asteroid.js")

const PATTERN = {
  "Call Asteroid": "Tremor Smash",
  "Damping Wallop": "random",
  "Tremor Smash": "random"
}
function earthlyKnightPattern(actionName) {
  return PATTERN[actionName]
}

module.exports = new EnemyTemplate("Earthly Knight",
  "Earth",
  250,
  100,
  "6",
  0,
  "Tremor Smash",
  false
).addAction({
  name: "Damping Wallop",
  element: "Earth",
  description: `Inflict ${getEmoji("Earth")} damage and remove a buff`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() + 75;
    changeStagger(targets, "elementMatchFoe");
    let resultString = dealDamage(targets, user, damage, false, user.element, adventure);
    const targetNames = getNames(targets, adventure);
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const targetBuffs = Object.keys(target.modifiers).filter(modifier => isBuff(modifier));
      if (targetBuffs.length > 0) {
        const buffIndex = adventure.generateRandomNumber(targetBuffs.length, "battle");
        const rolledBuff = targetBuffs[buffIndex];
        const wasRemoved = removeModifier([target], { name: rolledBuff, stacks: "all" }).length > 0;
        if (wasRemoved) {
          resultString += `${targetNames[i]} lost ${rolledBuff}.`;
        }
      }
    }
    return resultString;
  },
  selector: selectRandomFoe,
  needsLivingTargets: true,
  next: earthlyKnightPattern
}).addAction({
  name: "Tremor Smash",
  element: "Earth",
  description: `Deal minor ${getEmoji("Earth")} to all foes and stagger them`,
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    let damage = user.getPower() + 5;
    if (isCrit) {
      damage *= 2;
    }
    changeStagger(targets, 2);
    return dealDamage(targets, user, damage, false, user.element, adventure);
  },
  selector: selectAllFoes,
  needsLivingTargets: true,
  next: earthlyKnightPattern
}).addAction({
  name: "Call Asteroid",
  element: "Untyped",
  description: "Summon an Asteroid",
  priority: 0,
  effect: (targets, user, isCrit, adventure) => {
    spawnEnemy(asteroid, adventure);
    return "An Asteroid arrives on the battlefield.";
  },
  selector: selectNone,
  needsLivingTargets: false,
  next: earthlyKnightPattern
});
