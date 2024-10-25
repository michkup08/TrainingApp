import axios from "axios";
import Report from "../DTO/Report";

export const axiosInstance= axios.create();

export class ReportsApi {
    baseURL: string = "http://localhost:8080/trainingappdb/reports";

    GetReports = async (): Promise<Map<number, Report[]>> => {
        const resp = await axiosInstance.get(this.baseURL);
        console.log(resp);
        const reportsData:Report[] = resp.data;
        const usersReports = new Map<number, Report[]>();
        reportsData.forEach(r => {
            if(!usersReports.has(r.reportedId))
            {
                usersReports.set(r.reportedId, []);
            }
            usersReports.get(r.reportedId)!.push(r);
        });
        return usersReports;
    }

    PostReport = async(report:Report) => {
        await axiosInstance.post(this.baseURL, report);
    }

    CheckUsersReports = async(userId: number, blockUser:boolean) => {
        return await axiosInstance.put(`${this.baseURL}/checkReportsForUser/${userId}/${blockUser}`);
    }
}