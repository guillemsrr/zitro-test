import {AnswerData} from "db://assets/quiz/data/AnswerData";

export type QuestionData = {
    text: string;
    answers: AnswerData[];
};