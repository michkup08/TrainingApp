import { useState, useEffect } from 'react';
import '../css/Calendar.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const Calendar = () => {
    const [events, setEvents] = useState([]);
    const [currentDay, setCurrentDay] = useState(new Date().getDay() - 1);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [selectedDay, setSelectedDay] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        setEvents([]);
        const interval = setInterval(() => {
            setCurrentDay(new Date().getDay() - 1);
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRightClick = (dayIndex, e) => {
        e.preventDefault();
        setSelectedDay(dayIndex);
        setDialogVisible(true);
    };

    const handleAddEvent = () => {
        if (eventStart && eventEnd && eventStart < eventEnd) {
            setEvents([...events, { day: selectedDay, start: eventStart, end: eventEnd }]);
            setDialogVisible(false);
            setEventStart('');
            setEventEnd('');
        } else {
            alert('Invalid time range.');
        }
    };

    const timeToPosition = (time) => {
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
                        {events.filter(event => event.day === dayIndex).map((event, idx) => (
                            <div
                                key={idx}
                                className="event"
                                style={{
                                    top: `${timeToPosition(event.start)}px`,
                                    height: `${timeToPosition(event.end) - timeToPosition(event.start)}px`
                                }}
                            >
                                {event.start} - {event.end}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {dialogVisible && (
                <div className="dialog">
                    <div>
                        <label>Start: <input type="time" value={eventStart} onChange={(e) => setEventStart(e.target.value)} /></label>
                    </div>
                    <div>
                        <label>End: <input type="time" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} /></label>
                    </div>
                    <button onClick={handleAddEvent}>Add Event</button>
                    <button onClick={() => setDialogVisible(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Calendar;
