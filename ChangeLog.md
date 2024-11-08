# Prophets of the Labyrinth Change Log
## Prophets of the Labyrinth v0.17.0:
### Pets
Delvers can now bring pets with them on adventure. Which pet you bring can be configured during the preparation phase, or with `/favorite-pet`. One of the party's pets will use a supportive move each even round (or Loaf Around). Pets can also be leveled-up permenantly outside of adventure, which upgrades their moves (or gets them to stop Loafing Around). Your pet kennel is individual per server, so you can have different experiences with different friend groups.
### Beast Tamer
This new Archetype predicts the moves of enemies and pets (and if enemies have priority). Their Carrot gear entices an allied pet to act immediately and their Stick punishes foes that act with priority.
### Gear
- Reactive variants are back to a flat bonus
- Fixed delvers being able to end up above max HP when acquiring Cursed Blade
- Fixed Reckless Certain Victory not reporting its user paying HP
- Fixed Lance descriptions not accounting for double Power Up contribution
### Command Improvements
- Added `/manual modifier-info`
- Added context menu option to check a server member's PotL stats (Apps -> PotL Stats)
- Renamed `/give-up` to `/adventure retreat`
### Other Changes
- New Challenge: Cursed Run - One of your starting gear pieces is randomly replaced with cursed gear
- New Items: Creative Acorn, Flexigrass
- Fixed the party stats embed not showing the Final Battle after it had been scouted
- Fixed Curse of Midas reporting generating fractional gold, not scaling with stacks, and being added to party gold immediately instead of being added to loot
## Prophets of the Labyrinth v0.16.0:
### Archetypes
- Changed Detective to Untyped
   - The Detective was too much more powerful in battles where they innately had elemental advantage than those where the advantage was earned. Changing to Untyped both removes the possibility for innate elemental advantage and makes adding Pistol weakness to enemies always possible (no enemies resist Untyped).
- Changed Detective predict to weaknesses and random outcomes (no longer modifiers)
- Increased duration of Sabotage Kit (and upgrades) weakness by 1
- Changed Martial Artist Predict to Stagger and Enemy's next move
   - Now that predicts are unique info combinations, the Martial Artist is no longer stuck predicting speed (which hasn't been helpful in informing Stun strategies since the mechanics were made independent) in order to be able to predict Stagger. Predicting the move in the next round (note: not the upcoming round, but the one after that) is helpful for deciding if that move is worth attempting to avoid by pushing for Stun.
### Gear
- Changed effect of Hunter's variant to "gain Power Up on kill"
- Renamed Hunter's to Thief's
- Thief's Certain Victory → **Hunter's Certain Victory**
- Fixed a bug where Certain Victory and upgrades (except Reckless Certain Victory) was providing Power Up before dealing damage
- The Reactive variant now doubles damage instead of adding a set bonus
- Reduced Evade generation of Floating Mist Stance to 1 Evade per stack per turn, increased Stagger per stack to 3
- Increased Speed bonus on Scarves from 2 to 5
- Increased Regen on Infinite Regenerations from 3 to 4
- Fixed Iron Fist Punches applying 1 Stagger instead of 2
- Second Winds: durability down from 15 to 10, heals equal to user's power instead of 45 static
- Fixed crashes in Power from Wrath
- Renamed "Long" variants to "Potent"; "Long Barrier" renamed to "Vigilant Barrier", "Long Cloak" renamed to "Evasive Cloak"
- Fixed "Power from Wrath" and "Furious" scaling in the wrong direction
- New Gear: Hunter's Morning Star, Accurate Iron Fist Stance, Lucky Iron Fist Stance, Devoted Floating Mist Stance, Agile Floating Mist Stance, Lucky Second Wind, Flanking Strong Attack, Distracting Ice Bolt, Awesome Ice Bolt, Unlucky Ice Bolt, Wise Wolf Ring, Staggering Poison Torrent, Accelerating Refreshing Breeze, Supportive Refreshing Breeze, Swift Refreshing Breeze, Harmful Shoulder Throw, Staggering Shoulder Throw, Bashing Power from Wrath, Hunter's Power from Wrath, Staggering Power from Wrath, Flanking Goad Futility, Poised Goad Futility, Shattering Goad Futility, Accurate Scarf, Wise Scarf, Poised Chainmail, Powerful Chainmail, Distracting Prismatic Blast, Flanking Prismatic Blast, Midas's Risky Mixture, Purifying Infinite Regeneration, Omamori, Centering Omamori, Cleansing Omamori, Devoted Omamori, Heat Mirage, Evasive Heat Mirage, Unlucky Heat Mirage, Vigilant Heat Mirage
### Other Changes
- Parties gain 5 score for each Artifact Guardian they encounter
- Fixed a bug where not enough mechabees (both soldiers and drones) were spawning, reduced mechabee hp to compensate
- Predict info is now provided in the Ready a Move and Ready an Item messages (gear effects replaced, but can still be found in Inspect Self)
   - The challenge **Blind Avarice** has been removed; it was always sorta weird parties could drain themselves of money by clicking UI buttons accidentally
- Reduced Mechabee Drone and Soldier poise to 5
- Protection gained from Boat Parts no longer scales from more copies of Boat Parts
- Renamed the modifier "Stasis" to "Retain"
- Added Challenge: "Shoddy Craftsmanship" - For the next 5 rooms, gear you acquire has reduced durability reduced by 25%. Afterwards gain 250 gold.
- Added new Event room: Door 1 or Door 2?
- Tuned Elekmist actions' progress values
- Added Artifact: Loaded Dice
### Known Issues
- Two players clicking the "Scout the Final Boss" button at nearly the same time can double-charge the party
- Acquiring a Cursed Blade can leave the delver's current hp above their max hp
## Prophets of the Labyrinth v0.15.0:
After the systems focus in v0.14, this update is looping back to give some love to balance and content. One focus is adding more archetype differences so picking party composition is a more interesting decision; a step toward composition varying based on labyrinth choice. Predicts are now unique combinations of information. For example, multiple archetypes can predict HP, but only the Hemomancer can predict both HP and Speed.
### Detective
- Predict: Elements & Modifiers
- Added **Flanking Pistol**: damage reward for coordinating
- Added **Urgent Sabotage Kit**: priority improves the party's chance to get mileage out of the debuffs
- Fixed Pistol reporting the wrong ally getting Powered Up
### Hemomancer
- Predict: HP & Speed
- Urgent Life Drain → **Thirsting Life Drain**: trying to finish foes off has synergy with predicting HP
- Reactive Life Drain → **Furious Life Drain**: to reinforce HP management as Hemomancer gameplay
- Sweeping Blood Aegis → **Toxic Blood Aegis**: picking which foe to disrupt was important for the fun of the gear's strategy (also more Poison support)
### Legionnaire
- Predict: Critical Hits & Enemy Targets
- Vigilant Scutum → **Lucky Scutum**: Vigilance applies to Evade instead of protection
- Added **Lethal Shortsword**: crit synergy
- Fixed a crash in **Accelerating Shortsword**
### Ritualist
- Predict: Modifiers & Stagger
- Fate-Sealing Censer → **Staggering Censer**: to add Stun potential
- Flanking Corrosion → **Fate-Sealing Corrosion**: Ritualist doesn't have a speed predict for Exposed
### New Content
- Artifacts: Floating Multiplier, Peacock Charm, Best-in-Class Hammer
- Gear: Shoulder Throw, Goad Futility, Evasive Shoulder Throw, Sabotaging Cauldron Stir, Corrosive Cauldron Stir, Bouncing Medicine, Cleansing Medicine, Soothing Medicine, Distracting Poison Torrent
- Challenge: Into the Deep End
- Modifiers: Agility (buff: inverse of Paralysis, allows the bearer to shrug off 2 Stagger per turn), Lucky & Unlucky (buff/debuff pair, double/halve your chance to crit), Distracted (debuff: inverse of Vigilance, causes Exposed to be retained between rounds)
### Artifact Elements
Some artifacts are now associated with an element and will only available when a party member has that element (Untyped always available).
- Fire: Best-in-Class Hammer
- Water: Piggy Bank
- Earth: Boat Parts
- Wind: Hawk Tailfeather
- Light: Hammerspace Holster
- Darkness: Enchanted Map
### Changed Gear
- Removed starting gear from drop pool
- Increased Hunter's gear's reward to 30g per kill
- Removed **Sun Flares**: priority + stagger doesn't make sense when stun doesn't interact with speed
- Prideful Battleaxe → **Furious Battleaxe**: "maintain low HP" is a more engaging ask of the player than "accept dealing Untyped damage"
- Thick Battleaxe → **Reactive Battleaxe**: doubles down on acting after foes
- Mercurial Bow → **Unstoppable Bow**: Mercurial was too confusing
- Mercurial Firecracker → **Midas's Firecracker**: Mercurial was too confusing
- Increased Curse of Midas applied by **Midas Staves** to 2: to keep this competitive with Midas's Firecracker
- **War Cries** Fire → Light: Exposed is Light-style
- **Infinite Regenerations** Light → Fire: Regen is Fire-style
- **Spears** Wind → Earth: Stagger is Earth-style
- **Wise Chainmail** now increases stat growths by 10% instead of 1 level per combat
- Cursed gear now has negative base cost
### Other Changes
- New command: `/share-seed`
- Fixed Celestial Knight Insiginia triggering on turns the player is stunned
- Mechabee Barrel Rolls now add Agility to user on crit instead of more Evade
- Changed the Starry Knight's moveset ||to add Exposed and Distracted instead of Frail||
- Fixed some crashes when looking up items
- Exposed: increased bonus to 100%, fixed a bug where it didn't decrement on hit
- Manual Manual now increases stat growths by 10% instead of 1 level per combat
- Reduced crit rate gained from levelup from 1 to 0.25

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
