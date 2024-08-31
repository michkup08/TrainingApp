import axios from "axios";
import TrainingPlan from "../DTO/TrainingPlan";
import Training from "../DTO/Training";
import Exercise from "../DTO/Exercise";
import ExerciseWithParameters from "../DTO/ExerciseWithParameters";


export const axiosInstance= axios.create();

export class ExerciseApi {
    baseURL: string = "http://localhost:8080/trainingappdb/exercise";

    AllExercises = async (): Promise<Exercise[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/allExercises`);
        const exercisesData = resp.data;
        const exercises: Exercise[] = exercisesData.map((exercise: Exercise) => ({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            defaultValue: exercise.defaultValue
        }))

        return exercises;
    }

}