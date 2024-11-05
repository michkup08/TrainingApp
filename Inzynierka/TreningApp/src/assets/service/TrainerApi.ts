import axios from "axios";
import TrainerProfile from "../DTO/TrainerProfile";
import Trainer from "../DTO/Trainer";

export const axiosInstance= axios.create();

export class TrainerApi {
    baseURL: string = `${import.meta.env.VITE_BACKEND_LINK}/trainingappdb/trainer`;
    
    trainerProfile = async (userId:number): Promise<TrainerProfile> => {
      const resp = await axiosInstance.get(this.baseURL + `/profile/${userId}`);
      return resp.data;
    }

    getTrainersList = async (page:number): Promise<Trainer[]> => {
      try {
        const response = await axios.get(this.baseURL +`/trainers/${page}`);
        return response.data;
      } catch (error) {
          console.error('Error fetching posts:', error);
      }
      return [];
    }
}