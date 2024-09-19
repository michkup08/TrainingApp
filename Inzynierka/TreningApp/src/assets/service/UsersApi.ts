import axios from "axios";
import User from "../DTO/User";

export const axiosInstance= axios.create();

export class UsersApi {
    baseURL: string = "http://localhost:8080/trainingappdb/users";

    usersSearch = async (req:string): Promise<User[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/usersByReg/${req}`);
        const usersData = resp.data;
        const users: User[] = usersData.map((user: User) => ({
            id: user.id,
            name: user.name,
        }))

        return users;
    }

    fetchProfileImage = async (userId:number):Promise<string> => {
        try {
          const response = await axios.get(this.baseURL + `/image/${userId}`, {
            responseType: 'blob'
          });
      
          const url = URL.createObjectURL(new Blob([response.data]));
          return url;
        } catch (error) {
          console.error("Error fetching the image:", error);
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

    userUpdate = async (userId:number, login:string, password:string, email:string, oldPassword: string) => {
        try {
            return await axios.put(this.baseURL + `/updateUser`, {userId:userId, login:login, password:password, email:email, oldPassword:oldPassword});
        } catch (error) {   
            return 'Error updating user';
        }
    }
}