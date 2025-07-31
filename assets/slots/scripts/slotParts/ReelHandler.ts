import {_decorator, Component, Node, SpriteFrame, instantiate, Prefab, Layout, tween, Tween} from 'cc';
import {SlotSymbol} from 'db://assets/slots/scripts/slotParts/SlotSymbol';

const {ccclass, property} = _decorator;

@ccclass('ReelHandler')
export class ReelHandler extends Component {
    @property({type: Node, visible: true})
    private _symbolsParent: Node;

    @property({type: Layout, visible: true})
    private _verticalLayout: Layout;

    @property({type: Prefab, visible: true})
    private _symbolPrefab: Prefab;

    @property({type: SpriteFrame, visible: true})
    private _slotIcons: SpriteFrame[];

    @property({visible: true})
    private _numberSymbols: number = 10;

    @property({visible: true})
    private _symbolHeight: number = 120;

    @property({visible: true})
    private _spinSpeed: number = 1500;

    private _symbols: SlotSymbol[] = [];

    private _isSpinning: boolean = false;
    private _currentTween: Tween<any> | null = null;
    private _spinningSpeed: number = 0;

    private _isStopping: boolean = false;

    onLoad() {
        this._symbolsParent.destroyAllChildren();

        this._symbols = [];

        if (this._verticalLayout) {
            this._verticalLayout.enabled = false;
        }

        for (let i = 0; i < this._numberSymbols; i++) {
            const symbolNode = instantiate(this._symbolPrefab);
            symbolNode.setParent(this._symbolsParent);
            const symbol = symbolNode.getComponent(SlotSymbol)!;
            this.updateSymbol(symbol);
            const y = -this._symbolHeight * i - this._symbolHeight / 2;
            symbol.node.setPosition(0, y, 0);
            this._symbols.push(symbol);
        }
    }

    update(dt: number) {
        if (!this._isSpinning) return;

        const deltaY = this._spinningSpeed * dt;

        for (const symbol of this._symbols) {
            let pos = symbol.node.position;
            let newY = pos.y + deltaY;

            if (newY > this._symbolHeight / 2) {
                newY -= this._numberSymbols * this._symbolHeight;
                this.updateSymbol(symbol);
            }

            symbol.node.setPosition(0, newY, 0);
        }
    }

    reset() {
        this._symbols.forEach(symbol => {
            symbol.reset();
        })
    }

    spin() {
        if (this._isSpinning) return;
        this._isSpinning = true;
        this._isStopping = false;

        let obj = {speed: 0};
        this._currentTween = tween(obj)
            .to(0.5, {speed: this._spinSpeed}, {
                easing: 'quadIn',
                onUpdate: () => {
                    this._spinningSpeed = obj.speed;
                },
            })
            .start();
    }

    stop() {
        if (!this._isSpinning || this._isStopping) return;

        this._isStopping = true;

        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }

        let obj = {speed: this._spinningSpeed};

        this._currentTween = tween(obj)
            .to(0.5, {speed: 0}, {
                easing: 'quadOut',
                onUpdate: () => {
                    this._spinningSpeed = obj.speed;
                },
                onComplete: () => {
                    this._isSpinning = false;
                    this._spinningSpeed = 0;
                    this.reorderReel();
                }
            })
            .start();
    }

    getCenterSymbol(): SlotSymbol {
        if (this._symbols.length === 0) {
            return null;
        }
        const centerIndex = 1;
        return this._symbols[centerIndex];
    }

    getRandomSymbolIndex(): number {
        return Math.floor(Math.random() * this._slotIcons.length);
    }

    forceSymbolAtPositionIndex(winningSymbolIndex: number, positionIndex: number) {
        const height = -this._symbolHeight * positionIndex;
        const closestSymbol = this._symbols.reduce((prev, curr) => {
            return Math.abs(curr.node.position.y - height) < Math.abs(prev.node.position.y - height) ? curr : prev;
        });

        closestSymbol.iconSprite.spriteFrame = this._slotIcons[winningSymbolIndex];
        closestSymbol.identifier = winningSymbolIndex;

        //closestSymbol.setBackgroundColor(Color.BLUE);
    }

    private reorderReel() {
        for (const symbol of this._symbols) {
            let pos = symbol.node.position;
            if (pos.y > 0) {
                let newY = -this._numberSymbols * this._symbolHeight;
                this.updateSymbol(symbol);
                symbol.node.setPosition(0, newY, 0);
            }
        }

        this._symbols.sort((a, b) => b.node.position.y - a.node.position.y);

        for (let i = 0; i < this._symbols.length; i++) {
            const y = -i * this._symbolHeight - this._symbolHeight / 2;
            this._symbols[i].node.setPosition(0, y, 0);
        }
    }

    private updateSymbol(symbol: SlotSymbol) {
        const index = this.getRandomSymbolIndex();
        symbol.iconSprite.spriteFrame = this._slotIcons[index];
        symbol.identifier = index;
    }

}