import axios from "axios";
import User from "../DTO/User";

export const axiosInstance= axios.create();

export class UsersApi {
    baseURL: string = "http://localhost:8080/trainingappdb/users";

    UsersSearch = async (req:string): Promise<User[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/usersByReg/${req}`);
        const usersData = resp.data;
        const users: User[] = usersData.map((user: User) => ({
            id: user.id,
            name: user.name,
        }))

        return users;
    }
}