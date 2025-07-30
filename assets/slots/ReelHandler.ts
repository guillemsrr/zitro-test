import {_decorator, Component, Node, SpriteFrame, instantiate, Prefab, Vec3, Layout, tween, Tween} from 'cc';
import {Symbol} from 'db://assets/slots/Symbol';

const {ccclass, property} = _decorator;

@ccclass('ReelHandler')
export class ReelHandler extends Component {

    @property({type: Node, visible: true})
    _symbolsParent: Node;

    @property({type: Layout, visible: true})
    _verticalLayout: Layout;

    @property({type: Prefab, visible: true})
    _symbolPrefab: Prefab;

    @property({type: SpriteFrame, visible: true})
    _slotIcons: SpriteFrame[] = [];

    @property({visible: true})
    _numberSymbols: number = 10;

    @property({visible: true})
    _symbolHeight: number = 120;

    @property({visible: true})
    _spinDuration: number = 3;

    @property({visible: true})
    _spinSpeed: number = 1000;

    private _symbols: Symbol[] = [];
    private _isSpinning: boolean = false;

    onLoad() {
        this._symbolsParent.destroyAllChildren();

        this._symbols = [];

        if (this._verticalLayout) {
            this._verticalLayout.enabled = false;
        }

        for (let i = 0; i < this._numberSymbols; i++) {
            const symbolNode = instantiate(this._symbolPrefab);
            symbolNode.setParent(this._symbolsParent);
            const symbol = symbolNode.getComponent(Symbol)!;
            symbol.sprite.spriteFrame = this.getRandomSymbol();
            const y = -this._symbolHeight * i - this._symbolHeight / 2;
            symbol.node.setPosition(0, y, 0);
            this._symbols.push(symbol);
        }
    }

    spin() {
        if (this._isSpinning) return;
        this._isSpinning = true;

        const tweenAlpha = {alpha: 0};
        const totalDistance = this._spinSpeed * this._spinDuration;
        let lastAlpha = 0;

        const targetAlpha = 1;

        tween(tweenAlpha)
            .to(this._spinDuration, {alpha: targetAlpha}, {
                easing: 'quadInOut',
                onUpdate: () => {
                    const deltaAlpha = tweenAlpha.alpha - lastAlpha;
                    lastAlpha = tweenAlpha.alpha;
                    const deltaDistance = deltaAlpha * totalDistance;

                    for (const symbol of this._symbols) {
                        const pos = symbol.node.position;
                        let newY = pos.y + deltaDistance;

                        if (newY > this._symbolHeight / 2) {
                            newY -= this._numberSymbols * this._symbolHeight;
                            symbol.sprite.spriteFrame = this.getRandomSymbol();
                        }

                        symbol.node.setPosition(0, newY, 0);
                    }
                },
                onComplete: () => {
                    this._isSpinning = false;
                }
            })
            .start();
    }

    private getRandomSymbol(): SpriteFrame {
        const index = Math.floor(Math.random() * this._slotIcons.length);
        return this._slotIcons[index];
    }
}