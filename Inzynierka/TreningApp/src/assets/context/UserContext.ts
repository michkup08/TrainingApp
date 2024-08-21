import { createContext } from "react";
import User from "../objects/User";

export const UserContext = createContext<User>({});