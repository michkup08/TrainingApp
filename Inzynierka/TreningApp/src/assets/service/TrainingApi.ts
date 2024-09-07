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
                name: "No active plan",
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

    TrainingPlans = async (user_id:number): Promise<TrainingPlan[]> => {

        if(!user_id)
        {
            const trainingPlan: TrainingPlan = {
                id: 0,
                name: "No active plan",
                trenings: []
            }
            return [trainingPlan];
        }
        const resp = await axiosInstance.get(this.baseURL + `/trainingPlans/${user_id}`);

        const trainingPlansData = resp.data;
        
        if(trainingPlansData)
        {
            const trainingPlans: TrainingPlan[] = trainingPlansData.map((trainingPlanData: any) => ({
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
            }));

            return trainingPlans;
        }
        return [];
    }

    TrainingPlanById = async (plan_id:number): Promise<TrainingPlan> => {

        if(!plan_id)
        {
            const trainingPlan: TrainingPlan = {
                id: 0,
                name: "New training plan",
                trenings: []
            }
            return trainingPlan;
        }
        const resp = await axiosInstance.get(this.baseURL + `/trainingPlanById/${plan_id}`);

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
        const resp = await axiosInstance.put(this.baseURL + `/traningComplete`, {completePercent:completePercent, trainingId:trainingId});
        if(resp) return true;
        return false;
    }

    AddEmptyTrainingPlan = async (userId:number, name:string): Promise<number> => {
        const resp = await axiosInstance.post(this.baseURL + `/addEmptyTrainingPlan`, {id:userId, name:name});
        if(resp) return resp.data;
        return 0;
    }

    AddTrainingToPlan = async (training:Training, planId:number) => {
        await axiosInstance.post(this.baseURL + `/addTraining`, {id:training.id, name:training.name, day:training.day, startTime:training.startTime, stopTime:training.stopTime, exercises:training.exercises, planId:planId});
    }

    UpdateTraining = async (training:Training, planId:number) => {
        await axiosInstance.put(this.baseURL + `/updateTraining`, {id:training.id, name:training.name, day:training.day, startTime:training.startTime, stopTime:training.stopTime, exercises:training.exercises, planId:planId});
    }

    UpdatePlanName = async (planId:number, name:string) => {
        await axiosInstance.put(this.baseURL + `/changeTrainingPlanName`, {id:planId, name:name});
    }

    GetActivePlanId = async (userId:number) => {
        const resp = await axiosInstance.get(this.baseURL + `/getActiveId/${userId}`);
        if(resp) return resp.data;
        return 0;
    }

    UpdateActivePlan = async (userId:number, planId:number) => {
        await axiosInstance.put(this.baseURL + `/setActiveId`, {planId:planId, userId:userId});
    }
}