import axios from "axios";
import UserStats from "../DTO/UserStats";

export const axiosInstance= axios.create();

export class StatsApi {
    baseURL: string = `${import.meta.env.VITE_BACKEND_LINK}/trainingappdb/users`;

    GetUserStats = async (userId: number): Promise<UserStats> => {
        const resp = await axiosInstance.get(this.baseURL + `/userStatistics/${userId}`);
        const userStats:UserStats = {
            id : resp.data.id,
            daysInARow : resp.data.daysInARow,
            totalExercises: resp.data.totalExercises,
            totalTrainings: resp.data.totalTrainings
        };
        return userStats;
    }
}