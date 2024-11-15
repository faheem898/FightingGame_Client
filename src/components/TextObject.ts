import Phaser from 'phaser';

export class TextObject extends Phaser.GameObjects.Text {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        style?: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        // Default text style
        const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'ArialBold',  // Default font family
            fontSize: '25px',                  // Default font size (must be a string, e.g., '25px')
            color: '#ffffff',                  // Default text color
            align: 'center',                   // Default text alignment
            wordWrap: { width: 300 }           // Default word wrap width
        };

        // Merge the default style with any provided style
        const finalStyle = style ? { ...defaultStyle, ...style } : defaultStyle;

        // Call the parent constructor (Phaser.Text) with the final style
        super(scene, x, y, text, finalStyle);

        // Add the text object to the scene
        scene.add.existing(this);
    }

    // Set the text content
    setTextContent(newText: string): this {
        super.setText(newText);  // Call Phaser's setText method
        return this;
    }

    // Set the position of the text
    setPosition(x: number, y: number): this {
        super.setPosition(x, y);  // Call Phaser's setPosition
        return this;
    }

    // Set the font style (size, family, weight, etc.)
    setFontStyle(size: number | string, fontFamily: string = 'Arial', fontWeight: string = 'normal'): this {
        // Phaser's setStyle expects the style to be a string or a style object
        super.setStyle({
            fontSize: typeof size === 'number' ? `${size}px` : size,  // Ensure the size is in 'px' string format
            fontFamily,
            fontWeight
        });
        return this;
    }

    // Set the text color (can use hex color or RGB)
    setColorValue(color: string): this {
        super.setColor(color);  // Call Phaser's setColor method
        return this;
    }

    // Set the text alignment (left, center, right)
    setTextAlignment(alignment: string): this {
        super.setAlign(alignment);  // Call Phaser's setAlign method
        return this;
    }

    // Set the line spacing for multi-line text
    setLineSpacingValue(lineSpacing: number): this {
        super.setLineSpacing(lineSpacing);  // Call Phaser's setLineSpacing method
        return this;
    }

    // Set the alpha (transparency) of the text
    setAlphaValue(alpha: number): this {
        super.setAlpha(alpha);  // Call Phaser's setAlpha method
        return this;
    }

    // Set the visible state of the text object
    setVisibleState(visible: boolean): this {
        super.setVisible(visible);  // Call Phaser's setVisible method
        return this;
    }

    // Animate the text (for example, change scale, position, or alpha)
    animateText(animationType: string, duration: number = 500): this {
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

    // Make the text interactive (e.g., clickable)
    setInteractiveText(callback?: (pointer: Phaser.Input.Pointer, gameObject: this) => void): this {
        super.setInteractive();  // Call Phaser's setInteractive
        if (callback) {
            this.on('pointerdown', callback);  // Execute the callback on pointer down
        }
        return this;
    }

    // Play a sound when the text is clicked
    playSoundOnClick(soundKey: string): this {
        this.on('pointerdown', () => {
            this.scene.sound.play(soundKey);  // Play sound when the text is clicked
        });
        return this;
    }

    // Apply a shadow to the text (a workaround using text stroke)
    setTextShadow(color: string = 'black', blur: number = 5, offsetX: number = 2, offsetY: number = 2): this {
        // Phaser doesn't support text shadows directly, but you can use a stroke for a similar effect
        this.setStyle({
            shadowColor: color,
            shadowBlur: blur,
            shadowOffsetX: offsetX,
            shadowOffsetY: offsetY
        });
        return this;
    }

    // Set the text depth (z-index) (useful if you have other overlapping game objects)
    setDepthValue(depth: number): this {
        super.setDepth(depth);  // Call Phaser's setDepth method
        return this;
    }

    // Set a custom font family (optional feature)
    setFontFamily(fontFamily: string): this {
        super.setStyle({ fontFamily });
        return this;
    }
}
