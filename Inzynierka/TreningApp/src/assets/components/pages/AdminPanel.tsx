import { useEffect, useState } from "react"
import Report from "../../DTO/Report";
import { ReportsApi } from "../../service/ReportsApi";
import '../../css/AdminPanel.css'
import AvatarComponent from "../shared/Avatar";
import TrainingPlan from "../../DTO/TrainingPlan";
import { TrainingApi } from "../../service/TrainingApi";

const AdminPanel = () => {
    const reportsApi = new ReportsApi();
    const trainingsApi = new TrainingApi();
    const [reports, setReports] = useState<Map<number, Report[]> | null>(null);
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);

    useEffect(() => {
        reportsApi.GetReports().then((rep) => {
            setReports(rep);
            Array.from(rep.entries()).map(([key, reportList]) => {
                reportList.map((report) => {
                    if(report.communicateType == 'MESSAGE' && report.invalidCommunicate.trainingId)
                    {
                        const existingPlan = findPlanById(report.invalidCommunicate.trainingId);
                        if (!existingPlan) {
                            trainingsApi.TrainingPlanById(report.invalidCommunicate.trainingId).then(resp => {
                                setTrainingPlans(prev => [...prev, resp]);
                            })
                        }
                    }
                })
            })
        })
    }, [])

    const findPlanById = (id: number) => {
        return trainingPlans.find(plan => plan.id === id);
    };

    return (
        <div className='reportsContainer'>
            {reports && Array.from(reports.entries()).map(([key, reportList]) => (
                <div key={key} className='userReportsContainer'>
                    <h2>Reported:</h2>
                    <div className='reportedUserHeader'>
                        <AvatarComponent senderId={key} senderFullName={reportList[0].reportedFullName}/>
                        <label className='reportedFullName'>{reportList[0].reportedFullName}</label>
                    </div>
                    
                    {reportList.map((report, index) => (
                        <div key={index} className="reportContainer">
                            {report.communicateType === 'POST' && (
                                <div className="post-card">
                                    <div className="post-header">
                                        {<AvatarComponent senderId={report.reportedId} senderFullName={report.reportedFullName}/>}
                                        <div className="post-info">
                                            <span className="username">{report.reportedFullName}</span>
                                            <span className="post-time">{report.invalidPostDTO.dateTime}</span>
                                            
                                        </div>
                                    </div>
                                    <div className="postContextWrapper">
                                        <h4>{report.invalidPostDTO.context}</h4>
                                    </div>
                                    {report.invalidPostDTO.image && (<img 
                                        src={`data:image/jpeg;base64,${report.invalidPostDTO.image}`} 
                                        alt="Post image" 
                                        className="post-image"
                                    />)}
                                </div>
                            )}
                            {report.communicateType === 'COMMENT' && (
                                <div className={`message`}>
                                    <AvatarComponent senderId={report.invalidCommentDTO.senderId} senderFullName={report.invalidCommentDTO.senderName + ' ' + report.invalidCommentDTO.senderSurname}/>
                                    <div className="message-data">
                                        {report.invalidCommentDTO.content}
                                    </div>
                                </div>
                            )}
                            {report.communicateType === 'MESSAGE' && (
                                <div className={`message`}>
                                    <div className="avatar"><AvatarComponent senderId={report.invalidMessageDTO.senderId} senderFullName={report.invalidMessageDTO.senderName}/></div>
                                    <div className="message-data">
                                        {
                                            !report.invalidMessageDTO.trainingId ? 
                                            report.invalidMessageDTO.message:
                                            (
                                                <div className={"plan"}>
                                                    <div className="plan-name">{findPlanById(report.invalidMessageDTO.message.trainingId)?.name}</div>
                                                    <div className="trainings-container">
                                                        {findPlanById(report.invalidMessageDTO.message.trainingId)?.trenings.map((training, trainingIndex) => (
                                                            <div key={trainingIndex} className={"training"}>
                                                                <div className="training-name">{training.name}</div>
                                                                <div className="exercises-container">
                                                                    {training.exercises.map((exercise, exerciseIndex) => (
                                                                        <div key={exerciseIndex} className={"exercise"}>
                                                                            <div className="exercise-name">{exercise.exercise.name}</div>
                                                                            <div className="exercise-parameters">{exercise.parameters}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {(
                                                        <button className='planActivationButton' onClick={() => handleCopyPlanToMyPlans(message.trainingId!)}>Add to my plans</button>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            )}
                            <h2>Report descriptions</h2>
                            <label>{report.description}</label>
                            </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default AdminPanel
