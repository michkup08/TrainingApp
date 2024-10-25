import Message from "../../DTO/Message";
import Post from "../../DTO/Post";
import PostsComment from "../../DTO/Comment";
import AvatarComponent from "./Avatar";
import { useEffect, useState } from "react";
import TrainingPlan from "../../DTO/TrainingPlan";
import { TrainingApi } from "../../service/TrainingApi";
import '../../css/UserReport.css'
import { ReportsApi } from "../../service/ReportsApi";

interface UserReportProps {
    senderId: number;
    reportedId: number;
    reportedFullName: string;
    invalidCommunicate: Post | PostsComment | Message;
    communicateType: 'POST' | 'COMMENT' | 'MESSAGE';
    closeReportInterfaceFunction: () => void;
}

const UserReport = ({senderId, reportedId, reportedFullName, invalidCommunicate, communicateType, closeReportInterfaceFunction}: UserReportProps) => {
    const trainingsApi = new TrainingApi();
    const reportsApi = new ReportsApi();
    const [trainingPlan, setTrainingPlan] = useState<TrainingPlan>();
    const [reportDesc, setReportDesc] = useState('');

    useEffect(() => {
        if (communicateType === 'MESSAGE' && invalidCommunicate.trainingId) {
            trainingsApi.TrainingPlanById(invalidCommunicate.trainingId).then(resp => {
                setTrainingPlan(resp);
            })
        }
        console.log(reportedFullName);
    }, [])

    const handleSendReport = () => {
        reportsApi.PostReport({
            senderId: senderId, 
            reportedId: reportedId, 
            reportedFullName: reportedFullName, 
            description: reportDesc, 
            checked: false, 
            communicateType: communicateType, 
            communicateId: invalidCommunicate.id!, 
            id: undefined}).then(() => {
            closeReportInterfaceFunction();
        })
        console.log({
            senderId: senderId, 
            reportedId: reportedId, 
            reportedFullName: reportedFullName, 
            description: reportDesc, 
            checked: false, 
            communicateType: communicateType, 
            communicateId: invalidCommunicate.id!, 
            id: undefined
        })
    }

    return (
        <div>
            <h2>Report of user {reportedFullName}</h2>
             {communicateType === 'POST' && (
                <div className="post-card">
                    <div className="post-header">
                        {<AvatarComponent senderId={invalidCommunicate.senderId} senderFullName={invalidCommunicate.senderFullName}/>}
                        <div className="post-info">
                            <span className="username">{invalidCommunicate.senderFullName}</span>
                            <span className="post-time">{invalidCommunicate.dateTime}</span>
                            
                        </div>
                    </div>
                    <div className="postContextWrapper">
                        <h4>{invalidCommunicate.context}</h4>
                    </div>
                    {invalidCommunicate.image && (<img 
                        src={`data:image/jpeg;base64,${invalidCommunicate.image}`} 
                        alt="Post image" 
                        className="post-image"
                    />)}
                    <div className="post-details">
                        <span className="likes">{invalidCommunicate.likes} likes</span>
                    </div>
                </div>
            )}
            {communicateType === 'COMMENT' && (
                <div className={`message`}>
                    <AvatarComponent senderId={invalidCommunicate.senderId} senderFullName={invalidCommunicate.senderName + ' ' + invalidCommunicate.senderSurname}/>
                    <div className="message-data">
                        {invalidCommunicate.content}
                    </div>
                </div>
            )}
            {communicateType === 'MESSAGE' && (
                <div className={`message`}>
                    <div className="avatar"><AvatarComponent senderId={invalidCommunicate.senderId} senderFullName={invalidCommunicate.senderName}/></div>
                    <div className="message-data">
                        {
                            !invalidCommunicate.trainingId ? 
                            invalidCommunicate.message:
                            (
                                <div className={"plan"}>
                                    <div className="plan-name">{trainingPlan && trainingPlan.name}</div>
                                    <div className="trainings-container">
                                        {trainingPlan && trainingPlan.trenings.map((training, trainingIndex) => (
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
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
            <h2>What is wrong with that {communicateType.toLowerCase()}?</h2>
            <textarea
                rows={2}
                value={reportDesc}
                onChange={(e) => {setReportDesc(e.target.value)}} 
                className='reportDescInput'
                />
            <button onClick={handleSendReport}>Send report</button>
        </div>
    )
}

export default UserReport
