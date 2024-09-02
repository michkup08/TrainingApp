import { useContext, useEffect, useState } from 'react';
import TrainingPlan from '../DTO/TrainingPlan';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import '../css/MyPlans.css'

function MyPlansPage() {
    const trainingApi = new TrainingApi();
    const user = useContext(UserContext);
    const [plans, setPlans] = useState<TrainingPlan[]>([]);

    const fetchPlans = async () => {
        const resp = await trainingApi.TrainingPlans(user.id!);
        if (resp) {
            setPlans(resp);
        }
    }

    useEffect(() => {
        if (user) {
            fetchPlans();
        }
    }, [user]);

    return (
        <div className="plans-container">
            {plans.map((plan, planIndex) => (
                <div key={planIndex} className="plan">
                    <div className="plan-name">{plan.name}</div>
                    <div className="trainings-container">
                        {plan.trenings.map((training, trainingIndex) => (
                            <div key={trainingIndex} className="training">
                                <div className="training-name">{training.name}</div>
                                <div className="exercises-container">
                                    {training.exercises.map((exercise, exerciseIndex) => (
                                        <div key={exerciseIndex} className="exercise">
                                            <div className="exercise-name">{exercise.exercise.name}</div>
                                            <div className="exercise-parameters">{exercise.parameters}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MyPlansPage;
