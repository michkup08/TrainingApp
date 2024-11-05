import axios from "axios";
import Training from "../DTO/Training";


export const axiosInstance= axios.create();

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatTrainingsToString(trainings: Training[]): string {
    return trainings.map(training => {
        const dayName = dayNames[training.day]; // Zamiana numeru dnia na nazwę dnia

        const exercisesText = training.exercises.map(exerciseWithParams => {
            const { exercise, parameters } = exerciseWithParams;
            return `Exercise: ${exercise.name}, Parameters: ${parameters}`;
        }).join("\n    ");

        return `Training: ${training.name}
            Day: ${dayName}
            Start Time: ${training.startTime}
            Stop Time: ${training.stopTime}
            Completion: ${training.completePercent}%
            Exercises:${exercisesText}`;
    }).join("\n\n");
}

export class GeminiApi {
    baseURL: string =  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`;

    GetPlanRate = async (req:Training[]) => {
        if (!req) 
        {
            return '';
        }
        try 
        {
            const response = await axios.post(this.baseURL, {
                contents: [
                    {
                    parts: [{ text: `Take on the role of an experienced personal trainer - training specialist. Analyze and evaluate the training plan provided.`+
                        `Give possible alternative choices that could be more beneficial in your opinion. Your entire answer should fit into a few sentences.` + 
                        `The exact purpose and assumptions of the plan are not given. Try to deduce them based on what the plan looks like. It may turn out that, for example, exercise parameters should be ` + 
                        `the information provided, such as the number of sets and repetitions, is empty or written without meaning, or that the entire plan is empty or missing. In such situations, specify what ` + 
                        `is wrong and propose an example solution. The plan may include a warm-up and breaks between sets. If the plan is missing, write about it. ${formatTrainingsToString(req)}` }]
                    }
                ]
                }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(response)
            {
                return response.data;
            }
        } 
        catch (error) 
        {
        console.error("Error fetching the rate", error);
        }
        return null;
    };
}