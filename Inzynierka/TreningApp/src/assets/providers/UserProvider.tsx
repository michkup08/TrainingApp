import { ReactNode, useEffect, useState } from "react";
import  User from "../DTO/User";
import { UserContext } from "../context/UserContext";
import { AuthApi } from "../service/AuthApi";

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    
    const authApi = new AuthApi();
    const [user, setUser] = useState<User>({});

    useEffect(()=>{
        const loadUser = async () => {
            setUser(await authApi.Authorize());
        }
        loadUser();
    },[])

    return(
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;