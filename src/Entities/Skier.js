import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;

    direction = Constants.SKIER_DIRECTIONS.DOWN;
    speed = Constants.SKIER_STARTING_SPEED;
    action = Constants.SKIER_ACTIONS.SKYING;

    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    updateAsset() {
        this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }

    setAction(action) {
        this.action = action;
    }

    move() {
        console.log('Moving skier');
        switch(this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    turnLeft() {
        switch(this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT:
                this.moveSkierLeft();
                break;
            case Constants.SKIER_DIRECTIONS.CRASH:
                // When crashed, The skier gets up and is facing to the left
                this.moveSkierLeft();
                this.setDirection(Constants.SKIER_DIRECTIONS.LEFT);
                break;
            default:
                this.setDirection(this.direction - 1);
                break;
        }
    }

    turnRight() {
        if(this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierRight();
        }
        else {
            this.setDirection(this.direction + 1);
        }
    }

    jump() {
        if (this.isJumping()) {
            return false;
        }

        this.setAction(Constants.SKIER_ACTIONS.JUMPING);

        // Push the previous asset to restore the skier
        this.animate([...Constants.JUMP_FRAMES, this.assetName], Constants.JUMPING_DURATION).then(() => {
            this.setAction(Constants.SKIER_ACTIONS.SKYING)
        });
    }

    isJumping() {
        return this.action === Constants.SKIER_ACTIONS.JUMPING;
    }

    turnUp() {
        if(this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierUp();
        }
    }

    turnDown() {
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const skierBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        const collision = obstacleManager.getObstacles().find((obstacle) => {
            const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
            const obstaclePosition = obstacle.getPosition();
            const obstacleBounds = new Rect(
                obstaclePosition.x - obstacleAsset.width / 2,
                obstaclePosition.y - obstacleAsset.height / 2,
                obstaclePosition.x + obstacleAsset.width / 2,
                obstaclePosition.y
            );

            const hasCollition = intersectTwoRects(skierBounds, obstacleBounds);

            // If we hit a jump, then let's the skier jump
            if (hasCollition && obstacle.isRamp()) {
                this.jump();
                return false;
            }

            // If the skier is jumping and he hits an obstacle that can be jumped, then ignore the hit
            if (hasCollition && obstacle.canBeJumped() && this.isJumping()) {
                return false;
            }

            return hasCollition;
        });

        if(collision) {
            this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
        }
    };
}