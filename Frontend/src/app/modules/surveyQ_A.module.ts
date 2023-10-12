export class SurveyQuestion {
    $id: string;
    heading: string;
    id: number;
    isPublished: boolean;
    lastUpdatedOn: string;
    lastUpdatedBy: number;
    Options: string | null; // This can be a more complex type if needed
    survey: string | null;
    surveyAnswers: string | null
    SurveyId: number;

    new_survey_opt = new Array<SurveyOption>();
  
    constructor($id: string, heading: string, lastUpdatedBy: number,
        survey: string | null, surveyAnswers: string | null,
        surveyid: number,option: string,
        ispublished: number, lastUpdatedOn: string, isPublished: boolean,
        id: number) {
        this.$id = $id;
        this.heading = heading;
        this.SurveyId = surveyid;
        this.Options = option;
        this.survey = survey;
        this.id = id;
        this.isPublished = isPublished
        this.lastUpdatedOn = lastUpdatedOn;
        this.lastUpdatedBy = lastUpdatedBy
        this.surveyAnswers = surveyAnswers;
    }
}

export class new_SQus{
    id: number;
    heading: string;
    optList = new Array<new_SOpt>()
    belongToS: number;
    constructor(id: number, heading: string, belongToS: number){
        this.id = id;
        this.heading = heading;
        this.belongToS = belongToS;
    }
}

export class new_SOpt{
    id: number;
    label: string;
    question: number;

    constructor(id: number, label:string, question: number){
        this.question =question;
        this.label = label;
        this.id = id;
    }
}

export class new_SAns{
    userId: number;
    optionId: number;
    QuestionId: number;

    constructor(userId: number, optionId: number, ansId:number){
        this.optionId= optionId;
        this.userId = userId;
        this.QuestionId = ansId;
    }
}

export class SurveyOption{
    $id: string;
    id: number;
    Label: string;
    question: string | null;
    QuestionId: number;

    constructor($id: string, id: number, label:string, question: string | null, questionid:number){
        this.$id = $id;
        this.id = id;
        this.question = question;
        this.Label = label
        this.QuestionId = questionid;
    }
}

export class SurveyAnswer {
    Id: number;
    Heading: string;
    Answers: string[]; // This can be a more complex type if needed
    SurveyId: number;
  
    constructor(id: number, heading: string, answers: string[] = [], surveyid: number) {
        this.Id = id;
        this.Heading = heading;
        this.Answers = answers;
        this.SurveyId = surveyid;
    }
  }