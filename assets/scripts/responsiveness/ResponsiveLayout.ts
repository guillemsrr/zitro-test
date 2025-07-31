import {_decorator, Component, Layout} from 'cc';
import {OrientationService} from './OrientationService';

const {ccclass, property} = _decorator;

@ccclass('ResponsiveLayout')
export class ResponsiveLayout extends Component {

    @property({visible: true})
    private _horizontalSpacing: number = 25;

    @property({visible: true})
    private _verticalSpacing: number = 15;

    private _layout: Layout | null = null;

    onLoad() {
        this._layout = this.getComponent(Layout);
        if (!this._layout) {
            console.error("ResponsiveLayout requires a Layout component.");
            this.enabled = false;
            return;
        }
        
        if (this._layout.type === Layout.Type.HORIZONTAL) {
            this._horizontalSpacing = this._layout.spacingX;
        }
        else if (this._layout.type === Layout.Type.VERTICAL) {
            this._verticalSpacing = this._layout.spacingY;
        }

        OrientationService.instance.eventTarget.on(OrientationService.ON_ORIENTATION_CHANGED, this._onOrientationChange, this);
        this._onOrientationChange(OrientationService.instance.isLandscape());
    }

    onDestroy() {
        OrientationService.instance.eventTarget.off(OrientationService.ON_ORIENTATION_CHANGED, this._onOrientationChange, this);
    }

    private _onOrientationChange(isLandscape: boolean) {
        this._layout.type = isLandscape ? Layout.Type.HORIZONTAL : Layout.Type.VERTICAL;
        this._layout.spacingX = isLandscape ? this._horizontalSpacing : 0;
        this._layout.spacingY = isLandscape ? 0 : this._verticalSpacing;
        this._layout.updateLayout();
    }
}