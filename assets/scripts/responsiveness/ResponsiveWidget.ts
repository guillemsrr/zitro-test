import {_decorator, Component, Widget} from 'cc';
import {OrientationService} from "db://assets/scripts/responsiveness/OrientationService";

const {ccclass, property} = _decorator;

@ccclass('ResponsiveWidget')
export class ResponsiveWidget extends Component {

    @property({visible: true})
    private _portraitBottom: number = 200;

    @property({visible: true})
    private _landscapeBottom: number = 50;

    private widget: Widget | null = null;

    onLoad() {
        this.widget = this.getComponent(Widget);
        if (!this.widget) {
            console.error("ResponsiveWidget requires a Widget component.");
            this.enabled = false;
            return;
        }

        this.updateAlignment(OrientationService.instance.isLandscape());
        OrientationService.instance.eventTarget.on(OrientationService.ON_ORIENTATION_CHANGED, this.updateAlignment, this);

    }

    onDisable() {
        OrientationService.instance.eventTarget.off(OrientationService.ON_ORIENTATION_CHANGED, this.updateAlignment, this);
    }

    private updateAlignment(isLandscape: boolean) {
        if (!this.widget) return;
        this.widget.bottom = isLandscape ? this._landscapeBottom : this._portraitBottom;
        this.widget.updateAlignment();
    }
}