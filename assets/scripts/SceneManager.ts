import {_decorator, director} from 'cc';
import {Singleton} from "db://assets/scripts/core/Singleton";

const {ccclass, property} = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Singleton<SceneManager> {
    @property
    public menuScene: string = 'menu';
    @property
    public quizScene: string = 'quiz';
    @property
    public slotsScene: string = 'slots';

    public loadScene(name: string) {
        director.loadScene(name);
    }

    public loadMenu() {
        this.loadScene(this.menuScene);
    }
    
    public loadQuiz() {
        this.loadScene(this.quizScene);
    }

    public loadSlots() {
        this.loadScene(this.slotsScene);
    }
}