import {_decorator, Component} from 'cc';
import {OrientationService} from "db://assets/scripts/responsiveness/OrientationService";

const {ccclass, property} = _decorator;

@ccclass('ResponsiveScaler')
export class ResponsiveScaler extends Component {

    @property({visible: true})
    _horizontalScale: number = 1;

    @property({visible: true})
    _verticalScale: number = 1.5;

    onLoad() {
        this.updateScale(OrientationService.instance.isLandscape());
        OrientationService.instance.eventTarget.on(OrientationService.ON_ORIENTATION_CHANGED, this.updateScale, this);
    }

    onDisable() {
        OrientationService.instance.eventTarget.off(OrientationService.ON_ORIENTATION_CHANGED, this.updateScale, this);
    }

    private updateScale(isLandscape: boolean) {
        const scale = isLandscape ? this._horizontalScale : this._verticalScale;
        this.node.setScale(scale, scale, 1);
    }
}