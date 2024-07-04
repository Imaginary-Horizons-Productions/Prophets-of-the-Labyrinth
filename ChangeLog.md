# Prophets of the Labyrinth Change Log
## Prophets of the Labyrinth v0.15.0:
After the heavy systems focus in v0.14, this update is looping back to give some love to balance and content. One major focus is adding more differences between the archetypes so that picking party composition is a more interesting decision, a step toward getting to a place where it may vary based on labyrinth choice as well.
### Archetypes
Starting in this update, we're moving toward giving each Archetype a unique predict. These will be unique combinations of information, as opposed to fully unique types of information. For example, multiple different archetypes will be able to predcit HP, but only the Hemomancer will be able to predict both HP and Speed.

#### Detective
- Predict: Elements & Modifiers
- Added **Flanking Pistol**: more damage rewards for coordinating with allies
- Added **Urgent Sabotage Kit**: priority adds a chance to get more mileage out of the debuffs

#### Hemomancer
- Predict: HP & Speed
- Urgent Life Drain is now **Thirsting Life Drain**: trying to finish foes off has synergy with the new predict
- Reactive Life Drain is now **Furious Life Drain**: to reinforce HP management as Hemomancer gameplay
- Sweeping Blood Aegis is now **Toxic Blood Aegis**: picking which foe to disrupt was important for the fun of the gear's strategy (also more Poison support)

### Artifacts
Assigned Elements to the following artifacts. Artifacts are only available when a party member with the artifact's element is present (Untyped always available).
- Fire: Best-in-Class Hammer
- Water: Piggy Bank
- Earth: Boat Parts
- Wind: Hawk Tailfeather
- Light: Hammerspace Holster
- Darkness: Enchanted Map

#### New Artifacts
- Floating Multiplier: Increases the adventure's score by 25% per copy
- Peacock Charm: Gain copies + your remaining poise in protection each turn
- Best-in-Class Hammer: Gain copies extra room actions in Workshops

### Gear
- Increased the reward on Hunter's gear to 30g per kill
- Prideful Battleaxe is now **Furious Battleaxe**: "maintain low HP" is a more engaging ask of the player than "accept dealing Untyped damage"
- Thick Battleaxe is now **Reactive Battleaxe**: Thick isn't very Fire-style, Reactive doubles down on acting after foes

### Other Changes
- New starting challenge: Into the Deep End - Start the delve fighting an Artifact Guardian
- New command: `/share-seed` lets players share the seed of their completed adventure with others

## Prophets of the Labyrinth v0.14.0:
This update has a systems focus: making damage mitigation less situational by having Block (now protection) expire at end of combat instead of end of turn and adding a reward for the risk of combat via combat levels. There's also new content and balance such as: a new final boss, the Chemist rework, adding more AoE with the Blasting gear variant, and a few new artifacts.
### Labyrinths
Events, battles, artifact guardians, and bosses are now split among different labyrinths (Everything Bagel still has all content) to increase thematic and mechanical consistency. The current labyrinths are:
- Mechahive - Delve into this Earth/Darkness dungeon to put a stope to the Mechaqueen's new Mech Mode and Bee Mode
- Castle of the Celestial Knights - Go on a fantasy journey to knock some sense into the Starry Knight
- Zoo of Chimeras - The Elkemist is working on something sinister
### Combat Levels
- Delvers now levelup after combat, increasing their stats (1 level for normal battles, 3 levels for artifact guardians, 5 levels for final bosses)
### Block Rework
- Renamed to "protection"
- Expires at end of combat instead of end of turn
- Vigilance now applies to Evade instead of protection
### Chemist Starting Gear Rework
The Chemist was a powerful archetype, but the gameplay didn't allign with the theme. Most of the Chemist's value was in the extreme damage that Sickle dealt, and Potion Kit was largely too situational to be useful. Making potion generation the extra effect for the Chemist's offensive gear puts it on the same path as progress (read: damage) no longer forcing players to pick between theme and success. The Sickle is still around (and in the Water pool), but changing it from a Weapon to a Trinket prevents it from benefiting from Weapon Polish. Changing the Potion Kit to provide herbs instead spreads the loot generation effect out from only Water and the list of herbs is generally considered less situational than the potion list.
- Cauldron Stir: deals water damage and adds a potion to loot on crit
- Medicine: grants an ally Regen
- Sickle: renamed to Abacus, category changed to Trinket
- Potion Kit: reworked into Herb Basket; element changed to Earth, rollable items are now Panacea, Quick Pepper, Regen Root, and Strength Spinach
### Gear
- New Gear: Wise Chainmail, Prismatic Blast, Vexing Prismatic Blast, Cauldron Stir, Toxic Cauldron Stir, Medicine, Risky Mixture, Long Risky Mixture, Awesome Morning Star, Bashing Morning Star, Cursed Blade, Cursed Tome, Fever Break, Surpassing Fever Break, Organic Fever Break, Urgent Fever Break;
- Barriers now provide 3 Evade instead of 999 Block and are Wind element
- Vigilant Lance is now Shattering Lance
- Changed Toxic Abacus to Unstoppable Abacus
- Nerfed Corrosion to 20 Power Down base
### Artifacts
- New Artifact: Manual Manual
- Crystal Shard (artifact) now increases range of Spells--durability saving effect is now on the new Weapon Polish artifact, which applies to Weapons
### Other Changes
- New Challenge: Training Weights
- Reworked the Treasure Elemental ||Instead of a timed life, delvers can spend their turn adding Curse of Midas to the Elemental, which they now must defeat||
- Combined event rooms "Elemental Research" and "HP Redistribution" into "Imp Contract Faire"
- New Archetype: Fighter - Joke predict, simple starting gear, double stat growths
- Autocompleted values are now case-insensitive
## Prophets of the Labyrinth v0.13.2:
- Fixed a crash caused by new player profiles not rolling starting archetypes
## Prophets of the Labyrinth v0.13.1:
- Fixed a crash when moves targeted dead enemies
## Prophets of the Labyrinth v0.13.0:
- New Gear: Refreshing Breeze, Shattering Sabotage Kit, Harmful Corrosion, Shattering Corrosion, Wolf Ring, Surpassing Wolf Ring, Swift Wolf Ring, Harmful Poison Torrent, Ice Bolt, Scarf, Hearty Scarf, Chainmail
- Reworked Thick Cloak to Accurate Cloak
- Combined Barrier and Vigilance Charm
- New Artifacts: Celestial Knight Insignia, Boat Parts
- Bloodshield Sword (artifact) reworked into Health Insurance Loophole, now grants gold instead of block
- Doubled poise and added stagger, left per round fall-off and matching element stagger cure at 1
- Combatant stagger can no longer be modified while the combatant is stunned
- The Piercing gear variant is now Unstoppable; it is now also usable while Stunned
- Players now need to select their moves when Stunned (for Unstoppable)
- New Debuff: Frail - Deals damage when the bearer is Stunned
- Iron Fist Stance crits now apply Frail to all enemies instead of granting the user Power Up
- New Debuff: Paralysis - Stagger increases instead of falling off between rounds
- Some enemies's poise now scales with party size
- New Challenge: Unlabelled Placebos - Items have a chance to do nothing
- Tweaked room rarities, largely to make Battles and Events more common
- New Item: Panacea - Cures up to 2 debuffs on the user
- New Enemy: Mechabee Soldier
- Buffed Elkemist ||Toil removes a random debuff, Bubble converts buffs to Fire Weakness, Progress no longer grants Stasis||
- Forges are now Workshops: They now always offer repairs and upgrades. They will randomly offer one of the following: changing gear upgrades, increasing party gear capacity, or trading for an unknown upgraded gear.
- Gear that applies Stagger now accounts for Same Element Stagger Bonus in their descriptions
- New Command: `/manual enemy-info`
## Prophets of the Labyrinth v0.12.0:
- Reintroduced Light and Darkness elements
- Reworked Martial Artist starting gear
   - Iron Fist Stance: increases Punch damage and changes it to your element
   - Floating Mist Stance: grants Evade each turn and increases Punch inflicted by Stagger
- Renamed several entities:
   - Equipment to Gear
   - Consumables to Items
   - Stagger Threshold to Poise
   - \[Equipment's\] Uses to Durability
- New Gear: Iron Fist Stance, Organic Iron Fist Stance, Floating Mist Stance, Soothing Floating Mist Stance, Reactive Warhammer, Discounted Infinite Regneration, Discounted Midas Staff, Poison Torrent, Power from Wrath, Morning Star
- Fixed combat bugs caused by a target dying mid-round (particularly with Clones)
- Fix many incorrect price bugs (and similar "typo'd when entering data" bugs)
- Added `/regenerate` command, which resends the current room's message and UI
- Ritualist's target selection helper text now shows if the target has debuffs or not
- Buffed gear durability across the board by 50% or more (except Toxic Sickle, which had more durability than its peers)
- Tweaked room rarities, largely made Treasure rooms Rarer (buffed contents of Treasure rooms)
- Treasure rooms now have a random 2 of the following four options (players can still only pick one):
   - an artifact
   - 1 of 2 pieces of gear
   - a large sum of gold
   - a pair of items
- Reworked Block variants
   - Heavy - decomposed into the following
   - Guarding - adds Block to its target
   - Reinforced - adds Block to the user
- Combined `/armory` and `/conumable-info` into `/manual` using subcommands
- Combinde `/inspect-self` and `/party-stats` into `/adventure` using subcommands
- Added Detective archetype
- New players will now start with 3 random archetypes, if you'd like to test another archetype, contact a developer!
- Buffed Absorb potions to 3 stacks from 1
- Reduced Bloodtail Hawk's Rake damage from 50 to 45
- Reduced base crit chance to 1/5
- Hawk Tailfeather and Negative-One Leaf Clover now offer rerolls on fails
- Score for gold, lives, depth, and bonus update live; added score to `/adventure party-stats`
