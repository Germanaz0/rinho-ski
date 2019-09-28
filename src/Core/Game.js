import * as Constants from '../Constants';
import {AssetManager} from './AssetManager';
import {Canvas} from './Canvas';
import {Skier} from '../Entities/Skier';
import {ObstacleManager} from '../Entities/Obstacles/ObstacleManager';
import {Rect} from './Utils';
import {OverlayText} from './OverlayText'
import {Yeti} from '../Entities/Yeti'

export class Game {
    gameWindow = null;
    gameStatus = Constants.GAME_STATUS.INIT;
    overlayText = null;
    gameLoaded = false;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.obstacleManager = new ObstacleManager();
        this.overlayText = new OverlayText(this.canvas);
        this.rhino = new Yeti(0, 0);
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    init() {

    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    startGame() {
        if (!this.gameLoaded) {
            this.obstacleManager.placeInitialObstacles();
            this.gameLoaded = true;
        }

        this.updateGameWindow();
        this.drawGameWindow();
    }

    run() {
        this.canvas.clearCanvas();

        // GameStatus: Running, Pause or GameOver
        switch (this.gameStatus) {
            case Constants.GAME_STATUS.RUNNING:
                this.startGame();
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

        this.rhino.move(this.assetManager, this.gameWindow, this.skier).then(rhinoWins => {
            if (rhinoWins) {
                this.setGameOver();
            }
        });
    }

    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);
        this.skier.draw(this.canvas, this.assetManager);
        this.rhino.draw(this.canvas, this.assetManager);
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - (Constants.GAME_WIDTH / 2);
        const top = skierPosition.y - (Constants.GAME_HEIGHT / 2);

        this.gameWindow = new Rect(left, top, left + Constants.GAME_WIDTH, top + Constants.GAME_HEIGHT);
    }

    setPause() {
        if (this.gameStatus === Constants.GAME_STATUS.PAUSE) {
            return false;
        }

        this.gameStatus = Constants.GAME_STATUS.PAUSE;
    }

    setGameOver() {
        if (this.gameStatus === Constants.GAME_STATUS.GAME_OVER) {
            return false;
        }

        this.gameStatus = Constants.GAME_STATUS.GAME_OVER;
    }

    setResumeGame() {
        if (this.gameStatus === Constants.GAME_STATUS.RUNNING) {
            return false;
        }

        if (this.gameStatus === Constants.GAME_STATUS.GAME_OVER) {
            document.location.reload(true);
        }

        this.gameStatus = Constants.GAME_STATUS.RUNNING;
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
                this.setResumeGame();
                event.preventDefault();
                break;
            case Constants.KEYS.ESCAPE:
                this.setPause();
                event.preventDefault();
                break;
        }
    }
}