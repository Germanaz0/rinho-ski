import * as Constants from '../Constants';
import {AssetManager} from './AssetManager';
import {Canvas} from './Canvas';
import {Skier} from '../Entities/Skier';
import {ObstacleManager} from '../Entities/Obstacles/ObstacleManager';
import {Rect} from './Utils';
import {OverlayText} from './OverlayText'

export class Game {
    gameWindow = null;
    gameStatus = Constants.GAME_STATUS.INIT;
    overlayText = null;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.obstacleManager = new ObstacleManager();
        this.overlayText = new OverlayText(this.canvas);
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    init() {
        this.obstacleManager.placeInitialObstacles();
    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    run() {
        this.canvas.clearCanvas();

        // GameStatus: Running, Pause or GameOver
        switch (this.gameStatus) {
            case Constants.GAME_STATUS.RUNNING:
                this.updateGameWindow();
                this.drawGameWindow();
                break;
            case Constants.GAME_STATUS.GAME_OVER:
                this.overlayText.draw('Game Over');
                break;
            case Constants.GAME_STATUS.PAUSE:
                this.overlayText.draw('Game Paused');
                break;
            default:
                this.overlayText.draw('Welcome to Ski');
                break;
        }

        requestAnimationFrame(this.run.bind(this));
    }

    updateGameWindow() {
        this.skier.move();

        const previousGameWindow = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        this.skier.checkIfSkierHitObstacle(this.obstacleManager, this.assetManager);
    }

    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

        this.skier.draw(this.canvas, this.assetManager);
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - (Constants.GAME_WIDTH / 2);
        const top = skierPosition.y - (Constants.GAME_HEIGHT / 2);

        this.gameWindow = new Rect(left, top, left + Constants.GAME_WIDTH, top + Constants.GAME_HEIGHT);
    }

    handleKeyDown(event) {
        switch (event.which) {
            case Constants.KEYS.LEFT:
                this.skier.turnLeft();
                event.preventDefault();
                break;
            case Constants.KEYS.RIGHT:
                this.skier.turnRight();
                event.preventDefault();
                break;
            case Constants.KEYS.UP:
                this.skier.turnUp();
                event.preventDefault();
                break;
            case Constants.KEYS.DOWN:
                this.skier.turnDown();
                event.preventDefault();
                break;
            case Constants.KEYS.SPACE:
                this.skier.jump();
                event.preventDefault();
                break;
            case Constants.KEYS.ENTER:
                this.gameStatus = Constants.GAME_STATUS.RUNNING;
                event.preventDefault();
                break;
            case Constants.KEYS.ESCAPE:
                this.gameStatus = Constants.GAME_STATUS.PAUSE;
                event.preventDefault();
                break;
        }
    }
}