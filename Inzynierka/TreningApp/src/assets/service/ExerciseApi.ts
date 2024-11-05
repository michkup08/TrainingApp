import axios from "axios";
import Exercise from "../DTO/Exercise";

export const axiosInstance= axios.create();

export class ExerciseApi {
    baseURL: string = `${import.meta.env.VITE_BACKEND_LINK}/trainingappdb/exercise`;

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

    DeleteExerciseWithParameters = async(exerciseWithParametersId: number) => {
        await axiosInstance.delete(this.baseURL + `/exerciseWithParameters/${exerciseWithParametersId}`);
    } 

    exerciseSearch = async (req:string): Promise<Exercise[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/exercisesByReg/${req}`);
        return resp.data;
    }
}