/**
 * Base entity that others will extend from.
 */
export class Entity {
    x = 0;
    y = 0;

    assetName = '';
    animationInterval = null;

    /**
     * Entity constructor
     * @param x
     * @param y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Return the name of the current asset
     * @returns {string}
     */
    getAssetName() {
        return this.assetName;
    }

    /**
     * Return the current object position
     * @returns {{x: number, y: number}}
     */
    getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }

    /**
     * Draw the asset to a given canvas
     * @param canvas
     * @param assetManager
     */
    draw(canvas, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const drawX = this.x - asset.width / 2;
        const drawY = this.y - asset.height / 2;

        canvas.drawImage(asset, drawX, drawY, asset.width, asset.height);
    }

    /**
     * Execute an animation
     * @param frames array of asset names
     * @param time in milliseconds
     * @returns {Promise<void>}
     */
    animate(frames, time) {
        // Calculate the interval time by the frames that we have
        const intervalTime = Math.ceil(time / frames.length);

        // Callback to use with set interval
        const animateFrame = (resolve, reject) => {
            const currentFrame = frames.shift();
            // If we have no more frames, then finish the animation
            if (!currentFrame) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                resolve();
                return false;
            }

            // Set the asset to the entity
            this.assetName = currentFrame;
        };

        // Finally return a promise to extend functionality
        return new Promise((resolve, reject) => {
            // Set the interval
            this.animationInterval = setInterval(() => {
                animateFrame(resolve, reject);
            }, intervalTime);
        });


    }
}