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
                    parts: [{ text: `Wciel się w doświadczonego trenera personalnego - specjalistę od treningu. Przeanalizuj i oceń podany plan treningowy.`+
                        `Podaj ewentualne możliwości alternatywnych wyborów które mogłyby być twoim zdaniem korzystniejsze. Całość twojej odpowiedzi powinna mieścić się w kilku zdaniach. ${formatTrainingsToString(req)}` }]
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