import { useState, useEffect, useContext } from 'react';
import '../../css/TrainingPlan.css';
import { TrainingApi } from '../../service/TrainingApi';
import { UserContext } from '../../context/UserContext';
import Training from '../../DTO/Training';
import { Link, useNavigate } from 'react-router-dom';
import UserStats from '../../DTO/UserStats';
import { StatsApi } from '../../service/StatsApi';
import DialogComponent from '../shared/Dialog';
import useCheckAuth from '../../hooks/useCheckAuth';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const MainTrainingPlan = () => {
    const trainingApi = new TrainingApi();
    const statsApi = new StatsApi();
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [planId, setPlanId] = useState(0);
    const [planName, setPlanName] = useState('');
    const [currentDay, setCurrentDay] = useState(new Date().getDay() - 1);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [detailsTrainingDialogVisible, setDetailsTrainingDialogVisible] = useState(false);
    const [selectedTrainingId, setSelectedTrainingId] = useState(0);
    const [isToday, setIsToday] = useState(false);
    const [trainingCompleteSlider, setTrainingCompleteSlider] = useState(0);
    const [userStats, setUserStats] = useState<UserStats>({id: 0, daysInARow: 0, totalTrainings: 0, totalExercises: 0});
    const { checkIsUserAuthorized } = useCheckAuth();

    const fetchTrainingPlan = async() => {
        const resp = await trainingApi.TrainingPlan(user.id!);
        if(resp)
        {
            setTrainings(resp.trenings);
            setPlanName(resp.name);
            setPlanId(resp.id);
        }
    }

    const fetchStats = async() => {
        if(user && user.id)
        {
            const resp = await statsApi.GetUserStats(user.id!);
            if(resp)
            {
                setUserStats(resp);
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const day = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
            setCurrentDay(day);
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        checkIsUserAuthorized(user.id!);
        fetchTrainingPlan();
        fetchStats();
    }, [user]);

    const timeToPosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours - 3) * 60 + minutes;
    };

    const handleSetTrainingComplete = async(completePercent:number, trainingId:number) => {
        const resp = await trainingApi.SetTrainingComplete(completePercent, trainingId);
        if(resp)
        {
            fetchTrainingPlan();
        }
    } 

    const handleNewPlan = () => {
        sessionStorage.removeItem('editTrainingPlan');
        navigate('edit');
    } 

    const handleEditMainPlan = () => {
        sessionStorage.setItem('editTrainingPlan', String(planId));
        navigate('edit');
    } 

    return (
        <>
        <div className='trainingPlan'>
            <div className='trainingPlanManager'>
                <div className='planName'><h3>{planName}</h3></div>
                <nav>
                    {planId != 0 && <button onClick={() => handleEditMainPlan()} className='planNavLink'>Edit my main plan</button>}
                    <Link to='usersPlans' className='planNavLink'>My training plans</Link>
                    <button onClick={() => handleNewPlan()} className='planNavLink'>Add new plan</button>
                </nav>
                <div className='statsContainer'>
                    <div className='fireContainer'>
                        <img src='/images/fire.png' className='fireImage'/>
                        <h1 className='daysInARowCount'>{userStats.daysInARow}</h1>
                    </div>
                    <h4>days in a row!</h4>
                    <h4>{userStats.totalTrainings} total trainings</h4>
                    <h4>{userStats.totalExercises} total exercises</h4>
                </div>
                
            </div>
            <div className="weekly-calendar">
                <div className="header">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="day-header">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="table-body">
                    {hoursOfDay.map((hour) => (
                        <div key={hour} className="hour-label" style={{
                            transform: `translateY(${(hour-3)*60}px)`
                        }}>
                            {hour}:00
                        </div>
                    ))}
                    {daysOfWeek.map((day, dayIndex) => (
                        <div
                            key={dayIndex}
                            className={`day-column ${currentDay === dayIndex ? 'current-day' : ''}`}
                        >
                            {currentDay === dayIndex && <div
                                className= 'timeLine'
                                style={{
                                    top: `${timeToPosition(currentTime)}px`,
                                    height: `5px`,
                                    backgroundColor: `black`
                                }}
                            />}
                            {trainings.filter(training => training.day === dayIndex).map((training, idx) => (
                                <div
                                    key={idx}
                                    className="event"
                                    onClick={() => {
                                        setSelectedTrainingId(training.id);
                                        setIsToday(currentDay === dayIndex);
                                        setTrainingCompleteSlider(training.completePercent);
                                        setDetailsTrainingDialogVisible(true);
                                    }}
                                    style={{
                                        top: `${timeToPosition(training.startTime)}px`,
                                        height: `${timeToPosition(training.stopTime) - timeToPosition(training.startTime)}px`,
                                        background: currentDay < dayIndex ? `var(--orange2)` : training.completePercent===100 ? `green` : training.completePercent===0 ? `red` : `linear-gradient(green ${training.completePercent/2}%, red)`
                                    }}
                                >
                                    <h3 className='trainingTimeRange'>{training.startTime} - {training.stopTime}</h3>
                                    <h3 className='trainingname'>{training.name}</h3>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {detailsTrainingDialogVisible && 
            (
                <DialogComponent level={1} closeDialogFunction={() => setDetailsTrainingDialogVisible(false)} moveUp={false}>
                    {trainings.map((training)=>(
                        training.id==selectedTrainingId && (
                            <div key={selectedTrainingId}>
                                <div className='training_details_header'>{training.name}</div>
                                
                                <div className='trainingDayOfWeek'>{daysOfWeek[training.day]}</div>
                                <br/><br/>
                                <div className='trainingExercises'>
                                    {training.exercises.map((exercise)=>(
                                        <div className='training_details_header' key={exercise.id}>{ 
                                            exercise.exercise.name + ' : ' + exercise.parameters
                                        }</div>
                                    ))}
                                </div>
                                <br/>
                                Complete: {trainingCompleteSlider} %
                                {isToday && (
                                    <>
                                        <br/>
                                        {training.completePercent!=100 && 
                                            <input type='range' min='0' max='100' step='1' defaultValue={training.completePercent}
                                                onChange={(event) => setTrainingCompleteSlider(Number(event.target.value))}
                                                onMouseUp={() => handleSetTrainingComplete(trainingCompleteSlider, training.id)}
                                                /> 
                                        }
                                    </>
                                )}
                            </div>
                        )
                    ))}
                </DialogComponent>
            )}
        </>
    );
};

export default MainTrainingPlan;
