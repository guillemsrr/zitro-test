import {view, EventTarget} from 'cc';

export class OrientationService {
    private static _instance: OrientationService;
    private _isLandscape: boolean = false;

    public readonly eventTarget = new EventTarget();
    public static readonly ON_ORIENTATION_CHANGED = 'orientation-changed';

    public static get instance(): OrientationService {
        if (!this._instance) {
            this._instance = new OrientationService();
        }
        return this._instance;
    }

    private constructor() {
        this.updateOrientation();
        window.addEventListener('orientationchange', this._onWindowChange.bind(this));
        window.addEventListener('resize', this._onWindowChange.bind(this));
    }

    private _onWindowChange() {
        const oldIsLandscape = this._isLandscape;
        this.updateOrientation();
        if (this._isLandscape !== oldIsLandscape) {
            this.eventTarget.emit(OrientationService.ON_ORIENTATION_CHANGED, this._isLandscape);
        }
    }

    private updateOrientation() {
        const size = view.getVisibleSize();
        this._isLandscape = size.width > size.height;
    }

    public isLandscape(): boolean {
        return this._isLandscape;
    }
}