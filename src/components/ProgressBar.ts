import Phaser from 'phaser';

export class ProgressBar extends Phaser.GameObjects.Container {
    private barBase: Phaser.GameObjects.Sprite;
    private barFiller: Phaser.GameObjects.Sprite;
    private progress: number;
    private fillerOrigin: number;

    private baseWidth: number; // Original width of the base texture
    private baseHeight: number; // Original height of the base texture

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        barBaseTexture: string,
        barFillerTexture: string
    ) {
        super(scene, x, y);

        this.progress = 0; // Initial progress
        this.fillerOrigin = 0; // Default origin (left-to-right)

        // Create base sprite
        this.barBase = scene.add.sprite(0, 0, barBaseTexture);
        this.barBase.setOrigin(0.5, 0.5); // Center alignment
        this.baseWidth = this.barBase.width;
        this.baseHeight = this.barBase.height;

        // Create filler sprite
        this.barFiller = scene.add.sprite(0, 0, barFillerTexture);
        this.barFiller.setOrigin(0, 0.5); // Anchor at left-center by default

        // Add sprites to container
        this.add([this.barBase, this.barFiller]);

        // Add container to the scene
        scene.add.existing(this);

        // Update progress for the initial state
        this.updateProgress(0);
    }

    /**
     * Update the progress of the bar
     * @param value - Progress value (0 to 1)
     */
    updateProgress(value: number): this {
        this.progress = Phaser.Math.Clamp(value, 0, 1);

        // Adjust the filler scale based on progress
        this.barFiller.setScale(this.progress, 1);

        // Adjust position for right-to-left origin
        if (this.fillerOrigin === 1) {
            this.barFiller.setX(-this.barBase.displayWidth * (1 - this.progress) / 2);
        } else {
            this.barFiller.setX(-this.barBase.displayWidth / 2);
        }

        return this;
    }

    /**
     * Set the origin of the progress bar (0 for left-to-right, 1 for right-to-left)
     * @param origin - Origin value (0 or 1)
     */
    setFillerOrigin(origin: number): this {
        this.fillerOrigin = Phaser.Math.Clamp(origin, 0, 1);

        // Adjust filler sprite's anchor point
        this.barFiller.setOrigin(this.fillerOrigin, 0.5);

        // Reapply progress to adjust position
        this.updateProgress(this.progress);

        return this;
    }

    /**
     * Set the size of the progress bar
     * @param width - New width for the bar
     * @param height - New height for the bar
     */
    setSize(width: number, height: number): this {
        const widthScale = width / this.baseWidth;
        const heightScale = height / this.baseHeight;

        // Scale the base and filler sprites
        this.barBase.setDisplaySize(width, height);
        this.barFiller.setDisplaySize(width, height);

        // Reapply progress to ensure filler alignment
        this.updateProgress(this.progress);

        return this;
    }

    /**
     * Set the position of the progress bar
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    setPosition(x: number, y: number): this {
        super.setPosition(x, y);
        return this;
    }

    /**
     * Set the depth (z-index) of the progress bar
     * @param depth - Depth value
     */
    setDepthValue(depth: number): this {
        super.setDepth(depth);
        return this;
    }

    /**
     * Set the visibility of the progress bar
     * @param visible - Visibility state
     */
    setVisibleState(visible: boolean): this {
        super.setVisible(visible);
        return this;
    }
}
