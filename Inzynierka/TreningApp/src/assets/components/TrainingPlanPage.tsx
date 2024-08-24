import { useState, useEffect, useContext } from 'react';
import '../css/Calendar.css';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import Training from '../DTO/Training';
import Exercise from '../DTO/Exercise';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const TrainingPlanPage = () => {
    const trainingApi = new TrainingApi();
    const user = useContext(UserContext);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentDay, setCurrentDay] = useState(new Date().getDay() - 1);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [selectedDay, setSelectedDay] = useState(0);
    const [addTrainingDialogVisible, setAddTrainingDialogVisible] = useState(false);
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
            setCurrentDay(new Date().getDay() - 1);
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchTrainingPlan();
    }, [user]);

    const handleRightClick = (dayIndex: number, e: Event) => {
        e.preventDefault();
        setSelectedDay(dayIndex);
        setAddTrainingDialogVisible(true);
    };

    const handleAddEvent = () => {
        if (trainingStart && trainingEnd && trainingStart < trainingEnd) {
            setTrainings([...trainings, { day: selectedDay, startTime: trainingStart, stopTime: trainingEnd }]);
            setAddTrainingDialogVisible(false);
            setTrainingStart('');
            setTrainingEnd('');
        } else {
            alert('Invalid time range.');
        }
    };

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
                        onContextMenu={(e) => handleRightClick(dayIndex, e)}
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
                                    height: `${timeToPosition(training.stopTime) - timeToPosition(training.startTime)}px`
                                }}
                            >
                                {training.startTime} - {training.stopTime}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {addTrainingDialogVisible && 
            (
                <>
                    <div className='portal_background' onClick={() => setAddTrainingDialogVisible(false)}/>
                    <div className="dialog">
                        <div>
                            <label>Start: <input type="time" value={trainingStart} onChange={(e) => setTrainingStart(e.target.value)} /></label>
                        </div>
                        <div>
                            <label>End: <input type="time" value={trainingEnd} onChange={(e) => setTrainingEnd(e.target.value)} /></label>
                        </div>
                        <button onClick={handleAddEvent}>Add Training</button>
                        <button onClick={() => setAddTrainingDialogVisible(false)}>Cancel</button>
                    </div>
                    
                </>
                
            )}
            {detailsTrainingDialogVisible && 
            (
                <>
                    <div className='portal_background' onClick={() => setDetailsTrainingDialogVisible(false)}/>
                    <div className="dialog">
                        {trainings.map((training)=>(
                            training.id==selectedTrainingId && (
                                <>
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
                                    <input type='range' min='0' max='100' step='1' defaultValue={training.completePercent}
                                        onChange={(event) => setTrainingCompleteSlider(Number(event.target.value))}
                                        onMouseUp={() => handleSetTrainingComplete(trainingCompleteSlider, training.id)}
                                        /> 
                                </>
                            )
                        ))}
                        
                    </div>
                    
                </>
                
            )}
        </div>
    );
};

export default TrainingPlanPage;
