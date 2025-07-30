import {_decorator, Color, Component, Sprite, SpriteAtlas, SpriteFrame, UITransform} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('SlotSymbol')
export class SlotSymbol extends Component {

    @property(SpriteAtlas)
    symbolAtlas: SpriteAtlas | null = null;

    @property(Sprite)
    iconSprite: Sprite;

    @property(Sprite)
    backgroundSprite: Sprite;

    @property(UITransform)
    uiTransform: UITransform;

    @property(SpriteFrame)
    winBackgroundSpriteFrame: SpriteFrame;

    @property(SpriteFrame)
    looseBackgroundSpriteFrame: SpriteFrame;

    identifier: number = 0;

    start() {
        if (!this.iconSprite || !this.iconSprite.spriteFrame || !this.uiTransform) return;

        const spriteFrame = this.iconSprite.spriteFrame;
        const nativeSize = spriteFrame.originalSize;
        const containerSize = this.uiTransform.contentSize;

        const nativeAspect = nativeSize.width / nativeSize.height;
        const containerAspect = containerSize.width / containerSize.height;

        if (nativeAspect > containerAspect) {
            const height = containerSize.width / nativeAspect;
            this.uiTransform.setContentSize(containerSize.width, height);
        }
        else {
            const width = containerSize.height * nativeAspect;
            this.uiTransform.setContentSize(width, containerSize.height);
        }
    }

    equals(slotSymbol: SlotSymbol) {
        return this.identifier === slotSymbol.identifier;
    }

    setBackgroundColor(color: Color) {
        this.backgroundSprite.color = color;
    }

    reset() {
        this.backgroundSprite.spriteFrame = null;
    }

    setWinVisuals() {
        this.backgroundSprite.spriteFrame = this.winBackgroundSpriteFrame;
    }

    setLooseVisuals() {
        this.backgroundSprite.spriteFrame = this.looseBackgroundSpriteFrame;
    }
}