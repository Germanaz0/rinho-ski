export class OverlayText {
    hue = 100;
    direction = 1;
    transitioning = false;
    width = window.innerWidth;
    height = window.innerHeight;
    ctx = null;

    constructor(canvas) {
        this.ctx = canvas.ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    centerText(text, y) {
        const measurement = this.ctx.measureText(text);
        const x = Math.ceil((this.width - measurement.width) / 2);
        this.ctx.fillText(text, x, y);
    }

    draw(mainText) {
        // let's draw the text in the middle of the canvas
        // note that it's ineffecient to calculate this
        // in every frame since it never changes
        // however, I leave it here for simplicity
        const y = Math.ceil(this.height / 2) - 50;

        // create a css color from the `hue`
        const color = 'rgb(' + this.hue + ',0,0)';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        // clear the entire canvas
        // (this is not strictly necessary since we are always
        // updating the same pixels for this screen, however it
        // is generally what you need to do.)
        this.ctx.clearRect(0, 0, this.width, this.height);

        // draw the title of the game
        // this is static and doesn't change
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px monospace';
        this.centerText(mainText, y);

        // draw instructions to the player
        // this animates the color based on the value of `hue`
        this.ctx.fillStyle = color;
        this.ctx.font = '24px monospace';
        this.centerText('Press enter to play', y + 35);

        this.ctx.font = '16px monospace';
        this.centerText('Controls: arrow keys to move and space to jump', y + 75);

        this.ctx.font = '14px monospace';
        this.centerText('Escape to pause', y + 100);
    }
}