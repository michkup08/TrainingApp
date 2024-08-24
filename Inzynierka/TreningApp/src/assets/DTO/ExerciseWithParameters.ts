import Exercise from "./Exercise";

export default interface ExerciseWithParameters {
    id: number;
    parameters: string;
    exercise: Exercise;
}