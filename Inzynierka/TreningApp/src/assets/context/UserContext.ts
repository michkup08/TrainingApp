import { createContext } from "react";
import User from "../DTO/User";

export const UserContext = createContext<User>({});