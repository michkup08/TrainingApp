import { useState, useEffect, useContext } from 'react';
import '../css/Calendar.css';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import Training from '../DTO/Training';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const TrainingPlanPage = () => {
    const trainingApi = new TrainingApi();
    const user = useContext(UserContext);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [currentDay, setCurrentDay] = useState(new Date().getDay() - 1);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [selectedDay, setSelectedDay] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [trainingStart, setTrainingStart] = useState('');
    const [trainingEnd, setTrainingEnd] = useState('');
    const [modalOpened, setModalOpened] = useState(false);

    const fetchTrainingPlan = async() => {
        const resp = await trainingApi.TrainingPlan(user.id!);
        if(resp)
        {
            setTrainings(resp.trenings);
        }
    }

    useEffect(() => {
        setTrainings([]);
        const interval = setInterval(() => {
            setCurrentDay(new Date().getDay() - 1);
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchTrainingPlan();
    }, [user]);

    const handleRightClick = (dayIndex, e) => {
        e.preventDefault();
        setSelectedDay(dayIndex);
        setDialogVisible(true);
    };

    const handleAddEvent = () => {
        if (trainingStart && trainingEnd && trainingStart < trainingEnd) {
            setTrainings([...trainings, { day: selectedDay, startTime: trainingStart, stopTime: trainingEnd }]);
            setDialogVisible(false);
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
            {dialogVisible && (
                <div className="dialog">
                    <div>
                        <label>Start: <input type="time" value={trainingStart} onChange={(e) => setTrainingStart(e.target.value)} /></label>
                    </div>
                    <div>
                        <label>End: <input type="time" value={trainingEnd} onChange={(e) => setTrainingEnd(e.target.value)} /></label>
                    </div>
                    <button onClick={handleAddEvent}>Add Event</button>
                    <button onClick={() => setDialogVisible(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default TrainingPlanPage;
