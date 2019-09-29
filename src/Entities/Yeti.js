import {Entity} from './Entity';
import * as Constants from "../Constants";
import {intersectTwoRects, Rect} from '../Core/Utils'

export class Yeti extends Entity {
    assetName = Constants.RHINO_DEFAULT;

    dx = 0;
    dy = 0;
    speed = 0;
    action = Constants.RHINO_ACTIONS.RUNNING;

    constructor(x, y) {
        super(x, y);
    }

    setActionImage(angle, skier) {
        if (this.action === Constants.RHINO_ACTIONS.EATING) {
            return false;
        }

        if (this.x > skier.x) {
            this.assetName = angle > 120 ? Constants.RHINO_RUN_LEFT1 : Constants.RHINO_RUN_LEFT2;
        } else {
            this.assetName = Constants.RHINO_DEFAULT;
        }
    }

    move(assetManager, gameWindow, skier) {
        this.speed = skier.speed - 1;

        this.dx = (skier.x - this.x) * .125;
        this.dy = (skier.y - this.y) * .125;

        const distance = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
        const rad = Math.atan2(this.dy, this.dx);
        const angle = rad/Math.PI * 180;

        if(distance > this.speed){
            this.dx *= this.speed/distance;
            this.dy *= this.speed/distance;
        }

        this.setActionImage(angle, skier);

        this.x += this.dx;
        this.y += this.dy;

        const rhinoWins = this.checkIfRhinoWins(skier, assetManager);
        return new Promise((resolve, reject) => resolve(rhinoWins));
    }

    animateEat() {
        this.action = Constants.RHINO_ACTIONS.EATING;
        return this.animate([...Constants.RHINO_FRAMES], 3000);
    }

    checkIfRhinoWins(skier, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const skierAsset = assetManager.getAsset(skier.assetName);
        const rhinoBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        const skierBounds = new Rect(
            skier.x - skierAsset.width / 2,
            skier.y - skierAsset.height / 2,
            skier.x + skierAsset.width / 2,
            skier.y - skierAsset.height / 4
        );

        return intersectTwoRects(rhinoBounds, skierBounds);
    }
}