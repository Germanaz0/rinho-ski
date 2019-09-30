import "babel-polyfill";
import {Skier} from '../Entities/Skier'
import {ObstacleManager} from '../Entities/Obstacles/ObstacleManager'
import {Obstacle} from '../Entities/Obstacles/Obstacle'
import {AssetManager} from './AssetManager'
import * as Constants from '../Constants'

/**
 * Load mock assets
 * @returns {Promise<AssetManager>}
 */
const loaadAssets = async () => {
    const assetManager = new AssetManager();
    Object.keys(Constants.ASSETS).forEach((assetName, assetKey) => {
        const newImage = new Image(60, 60);
        newImage.src = Constants.ASSETS[assetName];
        assetManager.loadedAssets[assetName] = newImage;
    });
    return Promise.resolve(assetManager);
}


describe('Test skier and obstacles', () => {
    it('When crash and skier moves to left it should not trigger an error', async () => {
        const assetManager = await loaadAssets();
        const skier = new Skier(100, 100);
        const obstacleManager = new ObstacleManager();
        const newObstacle = new Obstacle(100, 100);

        newObstacle.assetName = Constants.TREE_CLUSTER; // Make it a tree
        obstacleManager.obstacles.push(newObstacle);

        const hasCrashed = skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
        expect(hasCrashed).toBe(true);

        // This is the bug mentioned in the issue https://github.com/Germanaz0/rinho-ski/issues/1
        skier.turnLeft();
        expect(skier.getAssetName()).toBeDefined();
    })
});