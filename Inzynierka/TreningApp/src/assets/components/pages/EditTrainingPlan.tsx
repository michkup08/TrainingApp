import { useState, useEffect, useContext } from 'react';
import '../../css/TrainingPlan.css';
import { TrainingApi } from '../../service/TrainingApi';
import { UserContext } from '../../context/UserContext';
import Training from '../../DTO/Training';
import Exercise from '../../DTO/Exercise';
import { Link, useNavigate } from 'react-router-dom';
import ExerciseWithParameters from '../../DTO/ExerciseWithParameters';
import { ExerciseApi } from '../../service/ExerciseApi';
import DialogComponent from '../shared/Dialog';
import { GeminiApi } from '../../service/GeminiApi';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const hoursOfDay = Array.from({ length: 21 }, (_, i) => 3 + i); // Godziny od 3:00 do 23:00

const EditTrainingPlan = () => {
    const navigate = useNavigate();
    const trainingApi = new TrainingApi();
    const exerciseApi = new ExerciseApi();
    const geminiApi = new GeminiApi();
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
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogPosition, setDialogPosition] = useState({ top: 0, left: "50%" });
    const [planRate, setPlanRate] = useState('');

    const confirm = () => {
        sessionStorage.removeItem('editTrainingPlan');
        navigate('/trainingPlan/usersPlans');
    }

    const fetchTrainingPlan = async() => {
        const resp = await trainingApi.TrainingPlanById((Number) (sessionStorage.getItem('editTrainingPlan')!));
        if(resp)
        {
            setTrainings(resp.trenings);
            setPlanName(resp.name);
        }
    }

    const handleSearchChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        if (!event.target.value) {
            setExercises([]);
            return;
        }
        try {
            const resp = await exerciseApi.exerciseSearch(event.target.value);
            setExercises(resp);
        } 
        catch (err) {
            console.log("error during searching users");
        }
    };

    const initializeTraining = async() => {
        const resp = await trainingApi.AddEmptyTrainingPlan(user.id!, 'New plan');
        if(resp)
        {
            setPlanId(resp);
            sessionStorage.setItem('editTrainingPlan', String(resp));
            setPlanName('New plan');
        }
    }

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
    }, [user,]);

    useEffect(() => {
        if(!addTrainingDialogVisible && !detailsTrainingDialogVisible)
        {
            setTrainingStart('');
            setTrainingEnd('');
            setExercisesWithParameters([]);
            setTrainingName('New training')
        }
        else if(detailsTrainingDialogVisible)
        {
            const training = trainings.find(training => training.id === selectedTrainingId);
            if(training)
            {
                setExercisesWithParameters(training!.exercises);
                setTrainingName(training!.name);
                setTrainingStart(training!.startTime);
                setTrainingEnd(training!.stopTime);
            }
            
        }
    }, [addTrainingDialogVisible, detailsTrainingDialogVisible])

    useEffect(() => {
        updateDialogPosition();
        window.addEventListener('scroll', updateDialogPosition);
        return () => {
            window.removeEventListener("scroll", updateDialogPosition);
        }
    }, [])

    const updatePlanName = (newName:string) => {
        trainingApi.UpdatePlanName(planId, newName);
    }

    const handleAddExercise = (selectedExercise:Exercise) => {
        setExercisesWithParameters([...exercisesWithParameters, {exercise: selectedExercise!, parameters: selectedExercise!.defaultValue}]);
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
            trainingApi.AddTrainingToPlan(training, planId).then(() => {
                fetchTrainingPlan();
            })
        }
    };

    const handleUpdateTraining = async() => {
        setAddTrainingDialogVisible(false);
        setDetailsTrainingDialogVisible(false);
        if (trainingStart && trainingEnd && trainingStart < trainingEnd) {
            const training = trainings.find(training => training.id === selectedTrainingId)!;
            training.startTime = trainingStart;
            training.stopTime = trainingEnd;
            training.exercises = exercisesWithParameters;
            training.name = trainingName; 
            trainingApi.UpdateTraining(training, planId).then(() => {
                fetchTrainingPlan();
            })
        }
    }

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

    const handleDeleteExercise = (indexToRemove:number, exercisesWithParametersId: number) => {
        setExercisesWithParameters((prevExercises) =>
            prevExercises.filter((_, index) => index !== indexToRemove)
        );
        if(exercisesWithParametersId)
        {
            exerciseApi.DeleteExerciseWithParameters(exercisesWithParametersId);
        }
    }

    const handleRatePlan = () => {
        geminiApi.GetPlanRate(trainings).then((resp) => {
            setPlanRate(resp.candidates[0].content.parts[0].text)
        })
    }

    const updateDialogPosition = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        setDialogPosition({
          top: scrollY + windowHeight / 2,
          left: "50%",
        });
    };

    return (
        <div className='trainingPlan'>
            <div className='trainingPlanManager'>
                <div className='planNavLinkWrapper'>
                    <Link className='planNavLink' to='/trainingPlan'>Back to my plan</Link>
                </div>
                <div className='planName'>Write training name:</div>
                <div className='planName'><input className='planNameInput' type="text" defaultValue={planName} onChange={(e) => updatePlanName(e.target.value)}/></div>
                <div className='planNavLinkWrapper'>
                    <button className='planNavLink' onClick={confirm}>Confirm</button>
                    <button className='planNavLink' onClick={handleRatePlan}>Rate my plan</button>
                </div>
                <div className='planRates'>
                    {planRate}
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
                        <DialogComponent level={2}>
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
                                        <th>Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {exercisesWithParameters.map((ExerciseWithParameters, index) => (
                                        <tr key={index}>
                                            <td>{ExerciseWithParameters.exercise.name}</td>
                                            <td><input className='trainingPlanInput' type="text" onChange={(e) => handleUpdateExerciseParameters(ExerciseWithParameters.exercise.id, e.target.value)} defaultValue={ExerciseWithParameters.parameters}/></td>
                                            <td><button className='deleteExerciseButton' onClick={() => handleDeleteExercise(index, ExerciseWithParameters.id)}>x</button></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                            <h3>Select your exercises</h3>
                            <input
                                className='trainingPlanInput'
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search exercise"
                            />
                            <ul className='exerciseList'>
                                {exercises.length === 0 && searchQuery != '' && <p>No records</p>}
                                {exercises.map(exercise => (
                                    <li key={exercise.id} >
                                        <div className='member'>
                                            <div className='memberName' onClick={() => {handleAddExercise(exercise); setSearchQuery(""); setExercises([]);}}>{exercise.name}</div>
                                            <div className='moreInfo' onClick={() => setExercises((prev) => {
                                                return prev.map((exe) =>
                                                    exe === exercise ? {...exercise, showDesc:!exe.showDesc} : exe
                                                )
                                            })}>🛈</div>
                                        </div>
                                        {exercise.showDesc && <div className='exerciseDescription'>{exercise.description}</div>}
                                    </li>
                                ))}
                            </ul>
                            <button className='buttonGreen' onClick={handleAddTraining}>Add Training</button>
                            <button className='buttonRed' onClick={() => setAddTrainingDialogVisible(false)}>Cancel</button>
                        </DialogComponent>
                    </>
                )}
                {detailsTrainingDialogVisible && 
                (
                    <>
                        <div className='portal_background' onClick={() => setDetailsTrainingDialogVisible(false)}/>
                        <DialogComponent level={2}>
                            {trainings.map((training)=>(
                                training.id==selectedTrainingId && (
                                    <>
                                        <div key={selectedTrainingId}>
                                            <div className='training_details_header'><h3>Write training name:</h3></div>
                                            <div>
                                                <label>Name: <input className='trainingPlanInput' value={trainingName} onChange={(e) => setTrainingName(e.target.value)} /></label>
                                            </div>
                                            <div>
                                                <label>Start: <input className='trainingPlanInput' type="time" value={trainingStart} onChange={(e) => setTrainingStart(e.target.value)} /></label>
                                            </div>
                                            <div>
                                                <label>End: <input className='trainingPlanInput' type="time" value={trainingEnd} onChange={(e) => setTrainingEnd(e.target.value)} /></label>
                                            </div>
                                            
                                            <div>{daysOfWeek[training.day]}</div>
                                            <br/> 
                                            
                                            {exercisesWithParameters.length > 0 && (
                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Parameters</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {exercisesWithParameters.map((ExerciseWithParameters, index) => (
                                                        <tr key={index}>
                                                            <td>{ExerciseWithParameters.exercise.name}</td>
                                                            <td><input className='trainingPlanInput' type="text" onChange={(e) => handleUpdateExerciseParameters(ExerciseWithParameters.exercise.id, e.target.value)} defaultValue={ExerciseWithParameters.parameters}/></td>
                                                            <td><div className='deleteExerciseButtonWrapper'><button className='deleteExerciseButton' onClick={() => handleDeleteExercise(index, ExerciseWithParameters.id)}>x</button></div></td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            )}
                                            <input
                                                className='trainingPlanInput'
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                placeholder="Search exercise"
                                            />
                                            <ul className='exerciseList'>
                                                {exercises.length === 0 && searchQuery != '' && <p>No records</p>}
                                                {exercises.map(exercise => (
                                                    <li key={exercise.id} >
                                                        <div className='member'>
                                                            <div className='memberName' onClick={() => {handleAddExercise(exercise); setSearchQuery(""); setExercises([]);}}>{exercise.name}</div>
                                                            <div className='moreInfo' onClick={() => setExercises((prev) => {
                                                                return prev.map((exe) =>
                                                                    exe === exercise ? {...exercise, showDesc:!exe.showDesc} : exe
                                                                )
                                                            })}>🛈</div>
                                                        </div>
                                                        {exercise.showDesc && <div className='exerciseDescription'>{exercise.description}</div>}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className='buttonGreen' onClick={handleUpdateTraining}>Update Training</button>
                                            <button className='buttonRed' onClick={() => setDetailsTrainingDialogVisible(false)}>Cancel</button>
                                        </div>
                                    </>
                                )
                            ))}
                        </DialogComponent>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditTrainingPlan;
