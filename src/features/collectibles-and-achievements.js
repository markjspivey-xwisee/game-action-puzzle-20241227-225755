Sure, here's a production-ready code for the "Collectibles and Achievements" feature in a Phaser.js game, following best practices and including comments, documentation, error handling, logging, modularity, reusability, and basic tests.

```javascript
/**
 * @file collectibles-achievements.js
 * @author Your Name
 * @description Handles collectibles and achievements in a Phaser.js game
 */

/**
 * @class CollectiblesAchievements
 * @description Manages collectibles and achievements in a Phaser.js game
 */
class CollectiblesAchievements {
  /**
   * @constructor
   * @param {Phaser.Scene} scene - The current Phaser.Scene instance
   * @param {Object} config - Configuration options for collectibles and achievements
   * @param {Object} config.collectibles - Configuration for collectibles
   * @param {Object} config.achievements - Configuration for achievements
   */
  constructor(scene, config) {
    /**
     * @property {Phaser.Scene} scene - The current Phaser.Scene instance
     * @private
     */
    this.scene = scene;

    /**
     * @property {Object} collectibles - Configuration for collectibles
     * @private
     */
    this.collectibles = config.collectibles || {};

    /**
     * @property {Object} achievements - Configuration for achievements
     * @private
     */
    this.achievements = config.achievements || {};

    /**
     * @property {Object} collectedItems - Keeps track of collected items
     * @private
     */
    this.collectedItems = {};

    /**
     * @property {Object} unlockedAchievements - Keeps track of unlocked achievements
     * @private
     */
    this.unlockedAchievements = {};

    /**
     * @property {Phaser.GameObjects.Group} collectiblesGroup - Group for collectible sprites
     * @private
     */
    this.collectiblesGroup = this.scene.add.group();

    // Initialize collectibles and achievements
    this.initializeCollectibles();
    this.initializeAchievements();
  }

  /**
   * @method initializeCollectibles
   * @description Initializes collectibles based on the configuration
   * @private
   */
  initializeCollectibles() {
    try {
      Object.entries(this.collectibles).forEach(([key, config]) => {
        const collectible = this.scene.physics.add.group({
          key: config.spriteKey,
          repeat: config.count,
          setXY: config.setXY,
        });

        collectible.children.iterate((child) => {
          child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          child.setCollideWorldBounds(true);
        });

        this.scene.physics.add.overlap(
          this.scene.player,
          collectible,
          this.handleCollectibleCollision.bind(this, key),
          null,
          this
        );

        this.collectedItems[key] = 0;
        this.collectiblesGroup.add(collectible);
      });
    } catch (error) {
      console.error('Error initializing collectibles:', error);
    }
  }

  /**
   * @method initializeAchievements
   * @description Initializes achievements based on the configuration
   * @private
   */
  initializeAchievements() {
    try {
      Object.keys(this.achievements).forEach((key) => {
        this.unlockedAchievements[key] = false;
      });
    } catch (error) {
      console.error('Error initializing achievements:', error);
    }
  }

  /**
   * @method handleCollectibleCollision
   * @description Handles the collision between the player and a collectible
   * @param {string} collectibleKey - The key of the collected item
   * @param {Phaser.GameObjects.GameObject} player - The player object
   * @param {Phaser.GameObjects.GameObject} collectible - The collectible object
   * @private
   */
  handleCollectibleCollision(collectibleKey, player, collectible) {
    try {
      collectible.disableBody(true, true);
      this.collectedItems[collectibleKey]++;

      // Check if achievements are unlocked
      this.checkAchievements();

      // Implement additional logic for collecting items (e.g., score, UI updates)
      console.log(`Collected ${collectibleKey}. Total: ${this.collectedItems[collectibleKey]}`);
    } catch (error) {
      console.error('Error handling collectible collision:', error);
    }
  }

  /**
   * @method checkAchievements
   * @description Checks if any achievements are unlocked based on the collected items
   * @private
   */
  checkAchievements() {
    try {
      Object.entries(this.achievements).forEach(([key, config]) => {
        const { condition, reward } = config;
        const isUnlocked = condition(this.collectedItems);

        if (isUnlocked && !this.unlockedAchievements[key]) {
          this.unlockedAchievements[key] = true;
          console.log(`Achievement unlocked: ${key}`);

          // Implement additional logic for unlocking achievements (e.g., rewards, UI updates)
          if (reward) {
            reward();
          }
        }
      });
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }
}

/**
 * Example usage:
 *
 * const collectiblesConfig = {
 *   gem: {
 *     spriteKey: 'gem',
 *     count: 10,
 *     setXY: { x: 100, y: 100, stepX: 70 },
 *   },
 *   coin: {
 *     spriteKey: 'coin',
 *     count: 20,
 *     setXY: { x: 200, y: 200, stepX: 50 },
 *   },
 * };
 *
 * const achievementsConfig = {
 *   'collect-10-gems': {
 *     condition: (collectedItems) => collectedItems.gem >= 10,
 *     reward: () => {
 *       // Implement reward logic
 *       console.log('Reward: 100 points');
 *     },
 *   },
 *   'collect-20-coins': {
 *     condition: (collectedItems) => collectedItems.coin >= 20,
 *     reward: () => {
 *       // Implement reward logic
 *       console.log('Reward: Unlock new level');
 *     },
 *   },
 * };
 *
 * const config = {
 *   collectibles: collectiblesConfig,
 *   achievements: achievementsConfig,
 * };
 *
 * const collectiblesAchievements = new CollectiblesAchievements(this, config);
 */

/**
 * Basic tests using Jest
 */
describe('CollectiblesAchievements', () => {
  let collectiblesAchievements;
  let scene;

  beforeEach(() => {
    scene = {
      add: {
        group: jest.fn().mockReturnValue({}),
      },
      physics: {
        add: {
          group: jest.fn().mockReturnValue({
            children: {
              iterate: jest.fn(),
            },
          }),
          overlap: jest.fn(),
        },
      },
      player: {},
    };

    const config = {
      collectibles: {
        gem: {
          spriteKey: 'gem',
          count: 10,
          setXY: { x: 100, y: 100, stepX: 70 },
        },
      },
      achievements: {
        'collect-10-gems': {
          condition: (collectedItems) => collectedItems.gem >= 10,
          reward: jest.fn(),
        },
      },
    };

    collectiblesAchievements = new CollectiblesAchievements(scene, config);
  });

  test('should initialize collectibles and achievements', () => {
    expect(collectiblesAchievements.collectedItems).toEqual({ gem: 0 });
    expect(collectiblesAchievements.unlockedAchievements).toEqual({ 'collect-10-gems': false });
  });

  test('should handle collectible collision', () => {
    const player = {};
    const collectible = { disableBody: jest.fn() };
    collectiblesAchievements.handleCollectibleCollision('gem', player, collectible);
    expect(collectible.disableBody).toHaveBeenCalledWith(true, true);
    expect(collectiblesAchievements.collectedItems.gem).toBe(1);
  });

  test('should unlock achievement', () => {
    const reward = jest.fn();
    collectiblesAchievements.achievements['collect-10-gems'].reward = reward;

    for (let i = 0; i < 10; i++) {
      collectiblesAchievements.handleCollectibleCollision('gem', {}, {});
    }

    expect(collectiblesAchievements.unlockedAchievements['collect-10-gems']).toBe(true);
    expect(reward).toHaveBeenCalled();
  });
});
```

This code includes the following:

1. **JSDoc comments** for classes, methods, and properties, explaining their purpose and parameters.
2. **Error handling and logging** using try-catch blocks and console.error for logging errors.
3. **Modularity and reusability** by separating the CollectiblesAchievements class into its own file and making it configurable through an options object.
4. **Basic tests** using Jest for testing the initialization, collectible collision handling, and achievement unlocking.

The `CollectiblesAchievements` class manages the collectibles and achievements in a Phaser.js game. It initializes collectibles and achievements based on the provided configuration, handles collectible collisions, and checks for unlocked achievements based on the collected items.

The configuration objects `collectiblesConfig` and `achievementsConfig` define the collectibles and achievements, respectively. The `collectiblesConfig` specifies the sprite key, count, and positioning for each collectible type, while the `achievementsConfig` defines the conditions and rewards for each achievement.

The class includes methods for initializing collectibles and achievements, handling collectible collisions, and checking for unlocked achievements. It also maintains internal state for collected items and unlocked achievements.

The example usage section demonstrates how to create instances of the `CollectiblesAchievements` class with the provided configuration.

The basic tests using Jest cover the initialization of collectibles and achievements, handling collectible collisions, and unlocking achievements.

Note: This code assumes that you have set up a Phaser.js project and have the necessary dependencies installed. You may need to adjust the code to fit your specific project structure and requirements.