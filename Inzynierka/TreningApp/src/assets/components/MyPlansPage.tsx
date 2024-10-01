import { useContext, useEffect, useState } from 'react';
import TrainingPlan from '../DTO/TrainingPlan';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import '../css/MyPlans.css'
import { Link, useNavigate } from 'react-router-dom';
import User from '../DTO/User';
import { UsersApi } from '../service/UsersApi';
import { useWebSocket } from '../hooks/useWebSocket';

function MyPlansPage() {
    const {sendPrivateValue} = useWebSocket();
    const trainingApi = new TrainingApi();
    const usersApi = new UsersApi();
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [plans, setPlans] = useState<TrainingPlan[]>([]);
    const [activeId, setActiveId] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [selectReceiverDialogVisible, setSelectReceiverDialogVisible] = useState(false);

    const fetchPlans = async() => {
        const resp = await trainingApi.TrainingPlans(user.id!);
        if (resp) {
            setPlans(resp);
        }
    }

    const fetchActive = async() => {
        const resp = await trainingApi.GetActivePlanId(user.id!);
        if (resp) {
            setActiveId(resp);
        }
    }

    const planActivate = async(planId:number) => {
        await trainingApi.UpdateActivePlan(user.id!, planId);
    }

    useEffect(() => {
        if (user && user.id) {
            fetchPlans();
            fetchActive();
        }
    }, [user]);

    const handleSelectPlanToEdit = (planId:number) => {
        sessionStorage.setItem('editTrainingPlan', String(planId));
        navigate('/trainingPlan/edit');
    } 

    const handleGoToNewPlanPage = () => {
        sessionStorage.removeItem('editTrainingPlan');
        navigate('/trainingPlan/edit');
    } 

    const handlePlanActivation = async(e: React.MouseEvent<HTMLButtonElement>, planId:number) => {
        e.stopPropagation();
        planActivate(planId).then(() =>{ 
            fetchActive();
        })
    }

    const handlePlanSend = (e: React.MouseEvent<HTMLButtonElement>, planId:number) => {
        e.stopPropagation();
        setSelectedPlan(planId);
        setSelectReceiverDialogVisible(true);
    }

    const handleSearchChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        if (!event.target.value) {
            setUsers([]);
            return;
        }
        try {
            setLoadingUsers(true);
            const resp = await usersApi.usersSearch(event.target.value);
            setUsers(resp);
        } catch (err) {
            console.log("error during searching users");
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleSendPlan = (userId:number, userFullName:string, trainingPlanId:number) => {
        sendPrivateValue(userId, userFullName, trainingPlanId);
    }

    return (
        <div className='wrapper-plans-container'>
            <div className='navTrainingsWrapper'><Link className='trainingsNavButton' to='/trainingPlan'>Back to my main plan</Link></div>
            <div className="plans-container">
                {plans.map((plan, planIndex) => (
                    <div key={planIndex} className={plan.id === activeId ? "activePlan":"plan"} onClick={() => handleSelectPlanToEdit(plan.id)}>
                        <div className="plan-name">{plan.name}</div>
                        <div className="trainings-container">
                            {plan.trenings.map((training, trainingIndex) => (
                                <div key={trainingIndex} className={plan.id === activeId ? "activeTraining":"training"}>
                                    <div className="training-name">{training.name}</div>
                                    <div className="exercises-container">
                                        {training.exercises.map((exercise, exerciseIndex) => (
                                            <div key={exerciseIndex} className={plan.id === activeId ? "activeExercise":"exercise"}>
                                                <div className="exercise-name">{exercise.exercise.name}</div>
                                                <div className="exercise-parameters">{exercise.parameters}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {plan.id != activeId && (
                            <button className='planActivationButton' onClick={(e) => handlePlanActivation(e, plan.id)}>Activate</button>
                        )}
                        <button className='planActivationButton' onClick={(e) => handlePlanSend(e, plan.id)}>Send</button>
                    </div>
                ))}
                <div className={"plan"} onClick={() => handleGoToNewPlanPage()}>
                    <div className='plusWrapper'>
                        <h3 className='addNewTrainingText'>Add new training plan</h3>
                        <div className="plusContainer">
                            <h1 className='addNewTrainingSign'>+</h1>
                        </div>
                    </div>
                </div>
                {plans.length===0 && (
                    <h1>No plans</h1>
                )}
            </div>
            {selectReceiverDialogVisible && (
                <>
                    <div className='portal_background' onClick={() => setSelectReceiverDialogVisible(false)}/>
                    <div className="dialog">
                        <input
                            type="text"
                            onChange={handleSearchChange}
                            placeholder="Search user"
                        />
                        <ul>
                            {users.length === 0 && !loadingUsers && <p>No records</p>}
                            {users.map(user => (
                                <li key={user.id} onClick={() => handleSendPlan(user.id!, `${user.name!} ${user.surname!}`, selectedPlan)}>
                                    {user.name}
                                    <button>Send</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
                
            )}
        </div>
        
    );
}

export default MyPlansPage;
