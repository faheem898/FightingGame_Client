import Phaser from 'phaser';

export class SpriteObject extends Phaser.GameObjects.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);  // Call the parent constructor

        // Add the sprite to the scene
        scene.add.existing(this);
    }

    // Set the position of the sprite
    setPosition(x: number, y: number): this {
        super.setPosition(x, y); // Call Phaser's setPosition
        return this;
    }

    // Set the origin of the sprite (anchor point)
    setOrigin(x: number = 0.5, y: number = 0.5): this {
        super.setOrigin(x, y);  // Call Phaser's setOrigin
        return this;
    }

    // Set the scale of the sprite (uniform scaling)
    setScale(scaleX: number, scaleY: number = scaleX): this {
        super.setScale(scaleX, scaleY);  // Call Phaser's setScale
        return this;
    }

    // Set the rotation of the sprite (in radians)
    setRotation(rotation: number): this {
        super.setRotation(rotation);  // Call Phaser's setRotation
        return this;
    }

    // Set the alpha (transparency) of the sprite
    setAlphaValue(alpha: number): this {
        super.setAlpha(alpha);  // Call Phaser's setAlpha
        return this;
    }

    // Set the tint of the sprite
    setTintColor(color: number): this {
        super.setTint(color);  // Call Phaser's setTint
        return this;
    }

    // Set the frame of the sprite
    setFrame(frame: string | number): this {
        super.setFrame(frame);  // Call Phaser's setFrame
        return this;
    }

    // Set a custom animation (if you have sprite sheet or animations set up)
    playAnimation(key: string, frameRate: number = 24, repeat: number = -1): this {
        this.anims.play(key, true);
        this.anims.msPerFrame = 1000 / frameRate;
        this.anims.repeat = repeat;  // -1 means infinite loop
        return this;
    }

    // Stop any current animations
    stopAnimation(): this {
        this.anims.stop();
        return this;
    }

    // Make the sprite interactive (e.g., clickable)
    setInteractive(callback?: (pointer: Phaser.Input.Pointer, gameObject: this) => void): this {
        super.setInteractive();  // Call Phaser's setInteractive
        if (callback) {
            this.on('pointerdown', callback);
        }
        return this;
    }

    // Add a shadow to the sprite (workaround by using another sprite behind it)
    setShadow(offsetX: number, offsetY: number, color: string, blur: number): this {
        // Create a simple shadow effect using a darker-colored sprite behind the original one
        const shadow = this.scene.add.sprite(this.x + offsetX, this.y + offsetY, this.texture);
        shadow.setTint(Phaser.Display.Color.HexStringToColor(color).color);  // Set shadow color
        shadow.setAlpha(0.5);  // Set transparency for shadow

        // You can also scale or adjust shadow here if necessary
        shadow.setScale(1);  // Shadow scale can be adjusted if necessary

        return this;
    }

    // Add a physics body to the sprite (for collisions, etc.)
    // addPhysics(bodyType: Phaser.Physics.Arcade.Components.Body): this {
    //     this.setOrigin(0.5, 0.5);  // Center the sprite (useful for physics bodies)
    //     this.scene.physics.world.enable(this);  // Enable physics for the sprite
    //     return this;
    // }

    // // Set a collider between this sprite and another game object (e.g., another sprite)
    // setCollider(otherSprite: Phaser.GameObjects.Sprite, callback: Function): this {
    //     // Ensure the callback signature is correct (matching ArcadePhysicsCallback)
    //     if (callback && typeof callback === 'function') {
    //         this.scene.physics.add.collider(this, otherSprite, callback);
    //     } else {
    //         console.error('Callback must be a function.');
    //     }
    //     return this;
    // }

    // Set the depth (z-index) of the sprite
    setDepthValue(depth: number): this {
        super.setDepth(depth);  // Call Phaser's setDepth
        return this;
    }

    // Set the visible state of the sprite
    setVisibleState(visible: boolean): this {
        super.setVisible(visible);  // Call Phaser's setVisible
        return this;
    }

    // Animate the sprite (for example, change scale, position, or alpha)
    animateSprite(animationType: string, duration: number = 500): this {
        switch (animationType) {
            case 'fadeIn':
                super.setAlpha(0);
                this.scene.tweens.add({
                    targets: this,
                    alpha: 1,
                    duration: duration,
                    ease: 'Power2'
                });
                break;
            case 'fadeOut':
                this.scene.tweens.add({
                    targets: this,
                    alpha: 0,
                    duration: duration,
                    ease: 'Power2'
                });
                break;
            case 'scaleUp':
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: duration,
                    ease: 'Bounce.easeOut'
                });
                break;
            case 'scaleDown':
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    scaleY: 1,
                    duration: duration,
                    ease: 'Bounce.easeIn'
                });
                break;
            case 'move':
                this.scene.tweens.add({
                    targets: this,
                    x: this.x + 100,
                    y: this.y + 100,
                    duration: duration,
                    ease: 'Linear'
                });
                break;
            default:
                console.log('Unknown animation type');
        }
        return this;
    }

    // Play sound when interacting with the sprite (e.g., button click)
    playSound(soundKey: string): this {
        this.scene.sound.play(soundKey);  // Play the sound with the given key
        return this;
    }

    // Make the sprite draggable
    // setDraggable(): this {
    //     this.setInteractive({ draggable: true });  // Enable dragging
    //     this.on('drag', (pointer, dragX, dragY) => {
    //         this.setPosition(dragX, dragY);  // Update position during dragging
    //     });
    //     return this;
    // }
}
