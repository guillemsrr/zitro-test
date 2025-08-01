import {_decorator, Button, Component, JsonAsset, Label} from 'cc';
import {QuestionData} from "db://assets/quiz/data/QuestionData";
import {AnswerData} from "db://assets/quiz/data/AnswerData";
import {AnswerButtonHandler} from "db://assets/quiz/AnswerButtonHandler";
import {QuizVisualsHandler} from "db://assets/quiz/QuizVisualsHandler";

const {ccclass, property} = _decorator;

@ccclass('QuizHandler')
export class QuizHandler extends Component {
    @property(Label)
    questionLabel: Label | null = null;

    @property([AnswerButtonHandler])
    answerButtons: AnswerButtonHandler[] = [];

    private _questions: QuestionData[] = [];
    private _unaskedQuestions: QuestionData[] = [];

    @property(JsonAsset)
    quizJson: JsonAsset | null = null;

    @property({type: QuizVisualsHandler, visible: true})
    private _quizVisualsHandler: QuizVisualsHandler;

    start() {
        const data = this.quizJson.json as { questions: QuestionData[] };
        this._questions = data.questions;
        this.resetUnaskedQuestions();
        this.startRandomQuestion();
    }

    startRandomQuestion() {
        this.deActivateButtons();

        if (this._unaskedQuestions.length === 0) {

            //this.resetUnaskedQuestions();
            this._quizVisualsHandler.showGameOver();
            return;
        }

        const randomIndex: number = Math.floor(Math.random() * this._unaskedQuestions.length);
        const question: QuestionData = this._unaskedQuestions[randomIndex];
        this._unaskedQuestions.splice(randomIndex, 1);
        this.questionLabel.string = question.text;

        let answers = [...question.answers]
        answers = answers.sort(() => Math.random() - 0.5);
        answers.forEach((answer: AnswerData, index) => {
            if (index > this.answerButtons.length) {
                return;
            }

            const answerButtonHandler: AnswerButtonHandler = this.answerButtons[index];
            answerButtonHandler.reset();
            answerButtonHandler.label.string = answer.text;
            answerButtonHandler.button.node.on(Button.EventType.CLICK, () => {
                this.handleAnswerButton(answer, answerButtonHandler);
            });
        });

        this._quizVisualsHandler.startQuestionAnimation(this.activateButtons.bind(this));
    }

    private deActivateButtons() {
        this.answerButtons.forEach(answerButton => {
            answerButton.button.interactable = false;
        })
    }

    private activateButtons() {
        this.answerButtons.forEach(answerButton => {
            answerButton.button.interactable = true;
        })
    }

    private resetUnaskedQuestions() {
        this._unaskedQuestions = [...this._questions];
    }

    private handleAnswerButton(answer: AnswerData, answerButtonHandler: AnswerButtonHandler) {
        this.deActivateButtons();
        this.unsubcribeButtonsClickEvents();

        if (answer.isCorrect) {
            answerButtonHandler.playCorrectAnimation();
            this._quizVisualsHandler.winEffect(this.startRandomQuestion.bind(this));
        }
        else {
            answerButtonHandler.playIncorrectAnimation();
            this._quizVisualsHandler.looseEffect(this.startRandomQuestion.bind(this));
        }

    }

    private unsubcribeButtonsClickEvents() {
        this.answerButtons.forEach(answerButton => {
            answerButton.button.node.off(Button.EventType.CLICK);
        });
    }
}