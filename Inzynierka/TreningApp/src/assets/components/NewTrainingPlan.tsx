import { useState, useEffect, useContext } from 'react';
import '../css/TrainingPlan.css';
import { TrainingApi } from '../service/TrainingApi';
import { UserContext } from '../context/UserContext';
import Training from '../DTO/Training';
import Exercise from '../DTO/Exercise';
import { NavLink } from 'react-router-dom';
import ExerciseWithParameters from '../DTO/ExerciseWithParameters';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const NewTrainingPlan = () => {
    const trainingApi = new TrainingApi();
    const user = useContext(UserContext);
    const [planId, setPlanId] = useState(0);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [planName, setPlanName] = useState('');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedDay, setSelectedDay] = useState(0);
    const [addTrainingDialogVisible, setAddTrainingDialogVisible] = useState(false);
    const [detailsTrainingDialogVisible, setDetailsTrainingDialogVisible] = useState(false);
    const [selectedTrainingId, setSelectedTrainingId] = useState(0);
    const [trainingName, setTrainingName] = useState('');
    const [trainingStart, setTrainingStart] = useState('');
    const [trainingEnd, setTrainingEnd] = useState('');
    const [exercisesWithParameters, setExercisesWithParameters] = useState<ExerciseWithParameters[]>([]);

    const fetchExercises = async() => {
        const resp = await trainingApi.AllExercises();
        if(resp)
        {
            setExercises(resp);
            console.log(exercises);
        }
    }

    const fetchTrainingPlan = async() => {
        const resp = await trainingApi.TrainingPlanById(planId);
        if(resp)
        {
            console.log(resp);
            setTrainings(resp.trenings);
            setPlanName(resp.name);
        }
    }

    const initializeTraining = async() => {
        const resp = await trainingApi.AddEmptyTrainingPlan(user.id!, 'New plan');
        if(resp)
        {
            setPlanId(resp);
            sessionStorage.setItem('editTrainingPlan', String(resp));
            setPlanName('New plan');
            console.log(resp);
        }
    }

    useEffect(() => {
        fetchExercises();
    }, []);

    useEffect(() => {
        if(user)
        {
            if(sessionStorage.getItem('editTrainingPlan'))
            {
                setPlanId((Number) (sessionStorage.getItem('editTrainingPlan')!));
                fetchTrainingPlan();
            }
            else
            {
                initializeTraining();
            }
        }
    }, [user]);

    useEffect(() => {
        if(!addTrainingDialogVisible)
        {
            setTrainingStart('');
            setTrainingEnd('');
            setExercisesWithParameters([]);
            setTrainingName('New training')
        }
    }, [addTrainingDialogVisible])

    const updatePlanName = (newName:string) => {
        trainingApi.UpdatePlanName(planId, newName);
    }

    const handleAddExercise = (e) => {
        console.log(e.target.value);
        exercises.map((exercise) => {
            console.log(exercise.id, Number(e.target.value), exercise.id === Number(e.target.value));
            if(exercise.id === Number(e.target.value))
            {
                const selectedExercise = exercise;
                console.log(selectedExercise);
                setExercisesWithParameters([...exercisesWithParameters, {exercise: selectedExercise!, parameters: selectedExercise!.defaultValue}]);
            }
        });
        
    }

    const handleRightClick = (dayIndex: number, e) => {
        e.preventDefault();
        setSelectedDay(dayIndex);
        setAddTrainingDialogVisible(true);
    };

    const handleAddTraining = async() => {
        setAddTrainingDialogVisible(false);
        if (trainingStart && trainingEnd && trainingStart < trainingEnd) {
            const training: Training = {day: selectedDay, startTime: trainingStart, stopTime: trainingEnd, exercises: exercisesWithParameters, name:trainingName};
            trainingApi.AddTrainingToPlan(training, planId).then
                fetchTrainingPlan();
            
        }
    };

    const timeToPosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours - 3) * 60 + minutes;
    };

    const handleUpdateExerciseParameters = (id:number, value:string) => {
        setExercisesWithParameters((prev) => 
           prev.map((exercise) => 
                exercise.exercise.id === id ? {...exercise, parameters:value} : exercise
            ) 
        );
    }

    return (
        <div className='trainingPlan'>
            <div className='trainingPlanManager'>
                <div className='planName'>Write training name:</div>
                <div className='planName'><input className='planNameInput' type="text" defaultValue={planName}/></div>
                
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
                            className={`day-column`}
                            onContextMenu={(e) => handleRightClick(dayIndex, e)}
                        >
                            {trainings.filter(training => training.day === dayIndex).map((training, idx) => (
                                <div
                                    key={idx}
                                    className="event"
                                    onClick={() => {
                                        setSelectedTrainingId(training.id);
                                        setDetailsTrainingDialogVisible(true);
                                    }}
                                    style={{
                                        top: `${timeToPosition(training.startTime)}px`,
                                        height: `${timeToPosition(training.stopTime) - timeToPosition(training.startTime)}px`,
                                        background: `rgb(243, 93, 76)`
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
                                <label>Name: <input className='trainingPlanInput' value={trainingName} onChange={(e) => setTrainingName(e.target.value)} /></label>
                            </div>
                            <div>
                                <label>Start: <input className='trainingPlanInput' type="time" value={trainingStart} onChange={(e) => setTrainingStart(e.target.value)} /></label>
                            </div>
                            <div>
                                <label>End: <input className='trainingPlanInput' type="time" value={trainingEnd} onChange={(e) => setTrainingEnd(e.target.value)} /></label>
                            </div>
                            {exercisesWithParameters.length > 0 && (
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Parameters</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {exercisesWithParameters.map((ExerciseWithParameters) => (
                                        <tr key={ExerciseWithParameters.id}>
                                        <td>{ExerciseWithParameters.exercise.name}</td>
                                        <td><input className='trainingPlanInput' type="text" onChange={(e) => handleUpdateExerciseParameters(ExerciseWithParameters.exercise.id, e.target.value)} defaultValue={ExerciseWithParameters.parameters}/></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                            <h3>Select your exercises</h3>
                            <select className='trainingPlanSelect' onChange={handleAddExercise} defaultValue=''>
                                <option value='' disabled >
                                        Select exercise for add it to training
                                </option>
                                {exercises.map((exercise) => (
                                    
                                    <option key={exercise.id} value={exercise.id}>
                                        {exercise.name}
                                    </option>
                                ))}
                            </select>
                            <button className='buttonGreen' onClick={handleAddTraining}>Add Training</button>
                            <button className='buttonRed' onClick={() => setAddTrainingDialogVisible(false)}>Cancel</button>
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
                                        <div key={selectedTrainingId}>
                                            <div className='training_details_header'><h3>Write training name:</h3></div>
                                            {/* <div className='training_details_header'>{training.name}</div> */}
                                            
                                            <div>{daysOfWeek[training.day]}</div>
                                            <br/><br/>
                                            <div>
                                                {training.exercises.map((exercise)=>(
                                                    <div className='training_details_header'>{ 
                                                        exercise.exercise.name + ' : ' + exercise.parameters
                                                    }</div>
                                                ))}
                                            </div>
                                            
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

export default NewTrainingPlan;
