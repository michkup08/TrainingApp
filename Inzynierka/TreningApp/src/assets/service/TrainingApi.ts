import axios from "axios";
import TrainingPlan from "../DTO/TrainingPlan";
import Training from "../DTO/Training";
import Exercise from "../DTO/Exercise";
import ExerciseWithParameters from "../DTO/ExerciseWithParameters";


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
                exercises: training.exercises.map((exerciseWithParameters: ExerciseWithParameters) => ({
                    id: exerciseWithParameters.id,
                    parameters: exerciseWithParameters.parameters,
                    exercise: ({
                        id: exerciseWithParameters.exercise.id,
                        name: exerciseWithParameters.exercise.name,
                        description: exerciseWithParameters.exercise.description,
                        defaultValue: exerciseWithParameters.exercise.defaultValue
                    })
                }))
            }))
        };

        return trainingPlan;
    }

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

    SetTrainingComplete = async (completePercent:number, trainingId:number): Promise<boolean> => {
        
        console.log(completePercent, trainingId);
        const resp = await axiosInstance.put(this.baseURL + `/traningComplete`, {completePercent:completePercent, trainingId:trainingId});
        if(resp) return true;
        return false;
        
    }
}