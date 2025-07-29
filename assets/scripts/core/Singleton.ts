import {Component, game} from 'cc';

export abstract class Singleton<T> extends Component {
    private static _instance: any;

    public static get instance(): any {
        return this._instance;
    }

    protected onLoad(): void {
        const cls = this.constructor as any;

        if (cls._instance) {
            console.warn(`${cls.name} singleton instance already exists`);
            this.destroy();
            return;
        }

        cls._instance = this;
        //game.addPersistRootNode(this.node);
    }
}