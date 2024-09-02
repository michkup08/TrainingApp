import { useState, useEffect, useContext } from 'react';
import '../css/TrainingPlan.css';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import Training from '../DTO/Training';
import Exercise from '../DTO/Exercise';
import { Link, NavLink } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const MainTrainingPlan = () => {
    const trainingApi = new TrainingApi();
    const user = useContext(UserContext);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [planName, setPlanName] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentDay, setCurrentDay] = useState(new Date().getDay() - 1);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [selectedDay, setSelectedDay] = useState(0);
    const [detailsTrainingDialogVisible, setDetailsTrainingDialogVisible] = useState(false);
    const [selectedTrainingId, setSelectedTrainingId] = useState(0);
    const [trainingStart, setTrainingStart] = useState('');
    const [trainingEnd, setTrainingEnd] = useState('');
    const [trainingCompleteSlider, setTrainingCompleteSlider] = useState(0);

    const fetchTrainingPlan = async() => {
        const resp = await trainingApi.TrainingPlan(user.id!);
        if(resp)
        {
            setTrainings(resp.trenings);
            setPlanName(resp.name);
        }
    }

    const fetchExercises = async() => {
        const resp = await trainingApi.AllExercises();
        if(resp)
        {
            setExercises(resp);
        }
    }

    useEffect(() => {
        fetchExercises();
        const interval = setInterval(() => {
            const day = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
            setCurrentDay(day);
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchTrainingPlan();
    }, [user]);

    const timeToPosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours - 3) * 60 + minutes;
    };

    const handleSetTrainingComplete = async(completePercent:number, trainingId:number) => {
        const resp = await trainingApi.SetTrainingComplete(completePercent, trainingId);
        if(resp)
        {
            //toast success
            fetchTrainingPlan();
        }
        //toast fail
    } 

    return (
        <div className='trainingPlan'>
            <div className='trainingPlanManager'>
                <div className='planName'><h3>{planName}</h3></div>
                <nav>
                    <Link to='/' className='planNavLink'>Edit my main plan</Link>
                    <Link to='usersPlans' className='planNavLink'>My training plans</Link>
                    <Link to='new' className='planNavLink'>Add new plan</Link>
                </nav>
                
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
                            {trainings.filter(training => training.day === dayIndex).map((training, idx) => (
                                <div
                                    key={idx}
                                    className="event"
                                    onClick={() => {
                                        setSelectedTrainingId(training.id);
                                        setTrainingCompleteSlider(training.completePercent);
                                        setDetailsTrainingDialogVisible(true);
                                    }}
                                    style={{
                                        top: `${timeToPosition(training.startTime)}px`,
                                        height: `${timeToPosition(training.stopTime) - timeToPosition(training.startTime)}px`,
                                        background: currentDay < dayIndex ? `rgb(243, 93, 76)` : training.completePercent===100 ? `green` : training.completePercent===0 ? `red` : `linear-gradient(green ${training.completePercent}%, red)`
                                    }}
                                >
                                    {training.startTime} - {training.stopTime}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                {detailsTrainingDialogVisible && 
                (
                    <>
                        <div className='portal_background' onClick={() => setDetailsTrainingDialogVisible(false)}/>
                        <div className="dialog">
                            {trainings.map((training)=>(
                                training.id==selectedTrainingId && (
                                    <>
                                        <div key={selectedTrainingId}>
                                            <div className='training_details_header'>{training.name}</div>
                                            
                                            <div>{daysOfWeek[training.day]}</div>
                                            <br/><br/>
                                            <div>
                                                {training.exercises.map((exercise)=>(
                                                    <div className='training_details_header'>{ 
                                                        exercise.exercise.name + ' : ' + exercise.parameters
                                                    }</div>
                                                ))}
                                            </div>
                                            <br/>
                                            Complete: {trainingCompleteSlider} %
                                            <br/>
                                            {training.completePercent!=100 && <input type='range' min='0' max='100' step='1' defaultValue={training.completePercent}
                                                onChange={(event) => setTrainingCompleteSlider(Number(event.target.value))}
                                                onMouseUp={() => handleSetTrainingComplete(trainingCompleteSlider, training.id)}
                                                /> }
                                        </div>
                                    </>
                                )
                            ))}
                            
                        </div>
                        
                    </>
                    
                )}
            </div>
        </div>
    );
};

export default MainTrainingPlan;
