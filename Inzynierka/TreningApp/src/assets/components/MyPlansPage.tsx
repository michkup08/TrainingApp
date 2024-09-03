import { useContext, useEffect, useState } from 'react';
import TrainingPlan from '../DTO/TrainingPlan';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import '../css/MyPlans.css'
import { Link, useNavigate } from 'react-router-dom';

function MyPlansPage() {
    const trainingApi = new TrainingApi();
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [plans, setPlans] = useState<TrainingPlan[]>([]);
    const [activeId, setActiveId] = useState(0);

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
                            <button className='planActivationButton' onClick={(e) => handlePlanActivation(e,plan.id)}>Activate</button>
                        )}
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
        </div>
        
    );
}

export default MyPlansPage;
