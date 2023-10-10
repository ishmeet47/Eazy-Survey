export class SurveyAnswer {
    id: number;
    title: string;
    questions: string[]; // This can be a more complex type if needed
  
    constructor(id: number, title: string, questions: string[] = []) {
        this.id = id;
        this.title = title;
        this.questions = questions;
    }
}


export class SurveyQuestion {
    id: number;
    title: string;
    questions: string[]; // This can be a more complex type if needed
  
    constructor(id: number, title: string, questions: string[] = []) {
        this.id = id;
        this.title = title;
        this.questions = questions;
    }
  }