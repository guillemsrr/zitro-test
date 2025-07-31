import {_decorator, Color, Component, Sprite, SpriteAtlas, SpriteFrame, UITransform} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('SlotSymbol')
export class SlotSymbol extends Component {

    @property(SpriteAtlas)
    symbolAtlas: SpriteAtlas | null = null;

    @property(Sprite)
    iconSprite: Sprite;

    identifier: number = -1;
    isFixed: boolean = false;

    @property(Sprite)
    backgroundSprite: Sprite;

    @property(UITransform)
    uiTransform: UITransform;

    @property(SpriteFrame)
    winBackgroundSpriteFrame: SpriteFrame;

    @property(SpriteFrame)
    looseBackgroundSpriteFrame: SpriteFrame;

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
        this.setBackgroundColor(Color.WHITE);
        this.isFixed = false;
        this.identifier = -1;
    }

    setWinVisuals() {
        this.backgroundSprite.spriteFrame = this.winBackgroundSpriteFrame;
    }

    setLooseVisuals() {
        this.backgroundSprite.spriteFrame = this.looseBackgroundSpriteFrame;
    }
}