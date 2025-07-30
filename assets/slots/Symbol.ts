import {_decorator, Component, Node, Sprite, SpriteAtlas, SpriteFrame, UITransform} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('Symbol')
export class Symbol extends Component {

    @property(SpriteAtlas)
    symbolAtlas: SpriteAtlas | null = null;

    @property(Sprite)
    sprite: Sprite | null = null;

    @property(UITransform)
    uiTransform: UITransform;

    start() {
        if (!this.sprite || !this.sprite.spriteFrame || !this.uiTransform) return;

        const spriteFrame = this.sprite.spriteFrame;
        const nativeSize = spriteFrame.originalSize; // size in pixels
        const containerSize = this.uiTransform.contentSize;

        const nativeAspect = nativeSize.width / nativeSize.height;
        const containerAspect = containerSize.width / containerSize.height;

        if (nativeAspect > containerAspect) {
            // Sprite is wider: match width, scale height
            const height = containerSize.width / nativeAspect;
            this.uiTransform.setContentSize(containerSize.width, height);
        }
        else {
            // Sprite is taller: match height, scale width
            const width = containerSize.height * nativeAspect;
            this.uiTransform.setContentSize(width, containerSize.height);
        }
    }

}