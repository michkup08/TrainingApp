import axios from "axios";
import User from "../DTO/User";


export const axiosInstance= axios.create();

export class AuthApi {
    baseURL: string = "http://localhost:8080/trainingappdb/users";

    Register = async (login:string, password:string, email:string, name:string, surname:string, isTrainer:boolean, description:string, price:string, availability:string): Promise<User> => {
        const resp = await axiosInstance.post(this.baseURL + '/register', isTrainer ? 
            {login:login, password:password, email:email, role: "TRAINER", name:name, surname:surname, description:description, price:price, availability:availability}
            : {login:login, password:password, email:email, role: "CLIENT", name:name, surname:surname});
        console.log(resp);
        const user:User = {
            id : resp.data.user_id,
            login : resp.data.login,
            email : resp.data.email,
            role : resp.data.role,
            name : resp.data.name,
            surname : resp.data.surname,
            authToken : resp.data.authToken
        };
        return user;
    }

    Login = async (login:string, password:string): Promise<User> => {
        const resp = await axiosInstance.post(this.baseURL + '/login', {login:login, password:password});
        console.log(resp);
        const user:User = {
            id : resp.data.user_id,
            login : resp.data.login,
            email : resp.data.email,
            role : resp.data.role,
            name : resp.data.name,
            surname : resp.data.surname,
            authToken : resp.data.authToken
        };
        return user;
    }

    Authorize = async (): Promise<User> => {
        const authToken = sessionStorage.getItem('trainingAppAuthToken');
        if(authToken)
        {
            const resp = await axiosInstance.get(this.baseURL + `/authorization/${authToken}`);
            const user:User = {
                id : resp.data.user_id,
                login : resp.data.login,
                email : resp.data.email,
                role : resp.data.role,
                name : resp.data.name,
                surname : resp.data.surname,
                authToken : resp.data.authToken
            };
            return user;
        }
        sessionStorage.setItem('trainingAppAuthToken', '');
        const user:User = {};
        return user;
    }

}