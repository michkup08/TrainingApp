import { useEffect, useState } from "react";
import  User from "../objects/User";
import { UserContext } from "../context/UserContext";
import { AuthApi } from "../service/AuthApi";

export const UserProvider = ({ children }) => {
    
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