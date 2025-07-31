import {_decorator, Component, Vec3} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('WinParticleHandler')
export class WinParticleHandler extends Component {
    @property({visible: true})
    private _radius: number = 50;

    @property({type: Vec3, visible: true})
    private _speed: Vec3 = new Vec3(200, 400, 0);

    @property({visible: true})
    private _rotationSpeed: number = 2;

    private _angle: number = 0;

    private _maxScreenWidth = 1200;

    start() {
        this._angle = Math.random() * Math.PI * 2;
        const randomOffsetX = (Math.random() - 0.5) * 20;
        const randomOffsetY = (Math.random() - 0.5) * 20;

        this.node.position = new Vec3(randomOffsetX, randomOffsetY, 0);
    }

    update(deltaTime: number) {

        if (this.node.position.x > this._maxScreenWidth) {
            this.node.destroy();
        }

        const x = this.node.position.x + this._speed.x * deltaTime;
        this._angle += deltaTime * this._rotationSpeed;
        const y = this._speed.y * deltaTime + Math.sin(this._angle) * this._radius;

        this.node.position = new Vec3(x, y, 0);
    }
}