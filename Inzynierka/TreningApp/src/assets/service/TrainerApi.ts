import axios from "axios";
import TrainerProfile from "../DTO/TrainerProfile";

export const axiosInstance= axios.create();

export class TrainerApi {
    baseURL: string = "http://localhost:8080/trainingappdb/trainer";
    
    trainerProfile = async (userId:number): Promise<TrainerProfile> => {
        const resp = await axiosInstance.get(this.baseURL + `/profile/${userId}`);
        return resp.data;
    }
}