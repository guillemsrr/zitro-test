import {_decorator, Component, Node, SpriteFrame, instantiate, Prefab, Layout, tween, Tween, Vec3, Color} from 'cc';
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

    @property({visible: true})
    private _spinDownside: boolean = false;

    private _symbols: SlotSymbol[] = [];

    private _isSpinning: boolean = false;
    private _currentTween: Tween<any> | null = null;
    private _spinningSpeed: number = 0;
    private _spinAccelerationDuration: number = 0.5;
    private _finalSymbolAdjustmentTime: number = 0.25;

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

        let deltaY = this._spinningSpeed * dt;
        if (this._spinDownside) {
            deltaY *= -1;
        }

        for (const symbol of this._symbols) {
            let pos = symbol.node.position;
            let newY = pos.y + deltaY;

            if (this._spinDownside) {
                if (newY < -this._symbolHeight * 3 - this._symbolHeight / 2) {
                    newY += this._numberSymbols * this._symbolHeight;
                    this.updateSymbol(symbol);
                }
            }
            else {
                if (newY > this._symbolHeight / 2) {
                    newY -= this._numberSymbols * this._symbolHeight;
                    this.updateSymbol(symbol);
                }
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
        if (this._isSpinning) {
            return;
        }
        this._isSpinning = true;
        this._isStopping = false;

        this.resetCurrentTween();
        let obj = {speed: 0};
        this._currentTween = tween(obj)
            .to(this._spinAccelerationDuration, {speed: this._spinSpeed}, {
                easing: 'quadIn',
                onUpdate: () => {
                    this._spinningSpeed = obj.speed;
                },
            })
            .start();
    }

    stop() {
        if (!this._isSpinning || this._isStopping) {
            return;
        }

        this._isStopping = true;
        this.resetCurrentTween();

        let obj = {speed: this._spinningSpeed};
        this._currentTween = tween(obj)
            .to(this._spinAccelerationDuration, {speed: 0}, {
                easing: 'quadOut',
                onUpdate: () => {
                    this._spinningSpeed = obj.speed;
                },
            })
            .call(() => {
                this._isSpinning = false;
                this._spinningSpeed = 0;
                this.reorderReel();
            })
            .start();
    }

    private resetCurrentTween() {
        if (this._currentTween) {
            this._currentTween.stop();
            this._currentTween = null;
        }
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
        if (!this._spinDownside) {
            positionIndex += 3;
            positionIndex *= -1;
        }

        let height = this._symbolHeight * positionIndex;
        const closestSymbol = this._symbols.reduce((prev, curr) => {
            return Math.abs(curr.node.position.y - height) < Math.abs(prev.node.position.y - height) ? curr : prev;
        });

        this.setWinningSymbol(closestSymbol, winningSymbolIndex);

        //closestSymbol.setBackgroundColor(Color.BLUE);
    }

    setWinningSymbol(closestSymbol: SlotSymbol, winningSymbolIndex: number) {
        closestSymbol.iconSprite.spriteFrame = this._slotIcons[winningSymbolIndex];
        closestSymbol.identifier = winningSymbolIndex;
        closestSymbol.isFixed = true;
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
            tween(this._symbols[i].node)
                .to(this._finalSymbolAdjustmentTime, {position: new Vec3(0, y, 0)}, {
                    easing: 'quadOut',
                })
                .start();
        }
    }

    private updateSymbol(symbol: SlotSymbol) {
        if (symbol.isFixed) {
            return;
        }

        const index = this.getRandomSymbolIndex();
        symbol.iconSprite.spriteFrame = this._slotIcons[index];
        symbol.identifier = index;
    }
}