import {_decorator, Button, Component, JsonAsset, Label, resources} from 'cc';
import {QuestionData} from "db://assets/quiz/data/QuestionData";
import {AnswerData} from "db://assets/quiz/data/AnswerData";
import {AnswerButtonHandler} from "db://assets/quiz/AnswerButtonHandler";

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

    start() {
        //TODO: maybe use resources.load to load the JSON file dynamically
        const data = this.quizJson.json as { questions: QuestionData[] };
        this._questions = data.questions;
        this.resetUnaskedQuestions();
        this.startRandomQuestion();
    }

    startRandomQuestion() {
        if (this._unaskedQuestions.length === 0) {

            //TODO: game over, all questions have been asked
            this.resetUnaskedQuestions();
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
    }

    private resetUnaskedQuestions() {
        this._unaskedQuestions = [...this._questions];
    }

    private handleAnswerButton(answer: AnswerData, answerButtonHandler: AnswerButtonHandler) {
        if (answer.isCorrect) {
            answerButtonHandler.playCorrectAnimation();
        }
        else {
            answerButtonHandler.playIncorrectAnimation();
        }

        this.answerButtons.forEach(answerButton => {
            answerButton.button.node.off(Button.EventType.CLICK);
            answerButton.button.interactable = false;
        });

        this.scheduleOnce(() => {
            this.startRandomQuestion();
        }, 1);
    }
}