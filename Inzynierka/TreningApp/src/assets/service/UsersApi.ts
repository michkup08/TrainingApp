import axios from "axios";
import User from "../DTO/User";

export const axiosInstance = axios.create();

export class UsersApi {
  baseURL: string = `${import.meta.env.VITE_BACKEND_LINK}/trainingappdb/users`;

  usersSearch = async (req:string): Promise<User[]> => {
    const resp = await axiosInstance.get(this.baseURL + `/usersByReg/${req}`);
    const usersData = resp.data;
    const users: User[] = usersData.map((user: User) => ({
      id: user.id,
      name: user.name,
    }))
    return users;
  }

  userById = async (userId:number): Promise<User> => {
    const resp = await axiosInstance.get(this.baseURL + `/getById/${userId}`);
    const user = resp.data;
    user.id = resp.data.user_id;
    return user;
  }
  
  fetchProfileImage = async (userId:number):Promise<string> => {
    try {
      const response = await axios.get(this.baseURL + `/image/${userId}`, {
        responseType: 'blob'
      });
      if(response.status === 200)
      {
        const url = URL.createObjectURL(new Blob([response.data]));
        return url;
      }
      return '';
    } catch (error) {
      return '';
    }
  };

  profileImageUpload = async (formData:FormData): Promise<boolean> => {
    if (!formData) {
      return false;
    }
    try {
      await axios.post(this.baseURL + "/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (error) {
      console.error("Error uploading file", error);
    }
    return false;
  };

  userUpdate = async (userId:number, login:string, password:string, email:string, oldPassword: string, role:string, trainerProfileId:number, description:string, price:string, availability:string) => {
    try {
      return await axios.put(this.baseURL + `/updateUser`, {
        userId:userId, 
        login:login, 
        password:password, 
        email:email, 
        oldPassword:oldPassword, 
        role:role, 
        trainerProfileId:trainerProfileId, 
        description:description, 
        price:price, 
        availability:availability});
    } catch (error) {   
        return 'Error updating user';
    }
  }
}