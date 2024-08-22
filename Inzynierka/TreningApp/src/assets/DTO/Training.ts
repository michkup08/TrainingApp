import Exercise from "./Exercise";

export default interface Training {
    id: number;
    name: string;
    day: number;
    startTime: string;
    stopTime: string;
    completePercent: number;
    exercises: Exercise[];
}