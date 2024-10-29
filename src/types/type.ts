export interface Responce {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id : string;
    text: string;
    responces : Responce[];
    scoreGive: integer;
}

export interface Obstacle {
    id: string;
    body: any;
    type: string;
    question: Question | null;
}