import {_decorator, Button, Component, Label, Color, tween, Vec3, Sprite} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('AnswerButtonHandler')
export class AnswerButtonHandler extends Component {
    @property(Label)
    label: Label;

    @property(Button)
    button: Button;

    @property(Sprite)
    sprite: Sprite;

    @property
    private correctColor: Color = new Color(0, 255, 0, 255);

    @property
    private incorrectColor: Color = new Color(255, 0, 0, 255);

    @property
    private animationDuration: number = 0.5;

    @property
    private shakeIntensity: number = 5;

    private originalColor: Color = new Color();
    private originalScale: Vec3 = new Vec3();
    private originalPosition: Vec3 = new Vec3();

    onLoad() {
        this.originalColor = this.button.normalColor.clone();
        this.originalScale = this.node.scale.clone();
        this.originalPosition = this.node.position.clone();
    }

    public playCorrectAnimation() {
        this.sprite.color = this.correctColor;
        tween(this.node)
            .to(this.animationDuration, {scale: new Vec3(1.2, 1.2, 1.2)})
            .to(this.animationDuration, {scale: this.originalScale})
            .call(() => {
                this.button.normalColor = this.originalColor;
            })
            .start();
    }

    public playIncorrectAnimation() {
        this.sprite.color = this.incorrectColor;
        const sequence = tween(this.node)
            .to(this.animationDuration / 4, {position: new Vec3(this.originalPosition.x + this.shakeIntensity, this.originalPosition.y, this.originalPosition.z)})
            .to(this.animationDuration / 4, {position: new Vec3(this.originalPosition.x - this.shakeIntensity, this.originalPosition.y, this.originalPosition.z)})
            .to(this.animationDuration / 4, {position: new Vec3(this.originalPosition.x, this.originalPosition.y, this.originalPosition.z)})
            .call(() => {
                this.button.normalColor = this.originalColor;
            });

        sequence.repeat(2).start();
    }

    public reset() {
        this.sprite.color = this.originalColor;
        this.button.normalColor = this.originalColor;
        this.node.scale = this.originalScale;
    }
}