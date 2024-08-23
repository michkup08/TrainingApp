import axios from "axios";
import TrainingPlan from "../DTO/TrainingPlan";
import Training from "../DTO/Training";
import Exercise from "../DTO/Exercise";


export const axiosInstance= axios.create();

export class TrainingApi {
    baseURL: string = "http://localhost:8080/trainingappdb/training";

    TrainingPlan = async (user_id:number): Promise<TrainingPlan> => {

        if(!user_id)
        {
            const trainingPlan: TrainingPlan = {
                id: 0,
                name: "Brak aktywnego planu treningowego",
                trenings: []
            }
            return trainingPlan;
        }
        const resp = await axiosInstance.get(this.baseURL + `/trainingPlan/${user_id}`);
        console.log(resp);

        const trainingPlanData = resp.data;

        const trainingPlan: TrainingPlan = {
            id: trainingPlanData.id,
            name: trainingPlanData.name,
            trenings: trainingPlanData.trainingPlanDTOs.map((training: Training) => ({
                id: training.id,
                name: training.name,
                day: training.day,
                startTime: training.startTime,
                stopTime: training.stopTime,
                completePercent: training.completePercent,
                exercises: training.exercises.map((exercise: Exercise) => ({
                    id: exercise.id,
                    name: exercise.name,
                    description: exercise.description
                }))
            }))
        };

        return trainingPlan;
    }

    AllExercises = async (): Promise<Exercise[]> => {
        
        const resp = await axiosInstance.get(this.baseURL + `/allExercises`);

        const exercisesData = resp.data;

        console.log(exercisesData);
        const exercises: Exercise[] = exercisesData.map((exercise: Exercise) => ({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description
        }))

        console.log(exercises);

        return exercises;
    }
}