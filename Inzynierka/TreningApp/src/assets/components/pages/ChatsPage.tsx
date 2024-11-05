import { useContext, useEffect, useRef, useState } from 'react';
import '../init';
import { UserContext } from '../../context/UserContext';
import Chat from '../../DTO/Chat';
import { UsersApi } from '../../service/UsersApi';
import User from '../../DTO/User';
import { ChatsApi } from '../../service/ChatsApi';
import '../../css/Chats.css'
import { useLocation, useNavigate } from 'react-router-dom';
import TrainingPlan from '../../DTO/TrainingPlan';
import { TrainingApi } from '../../service/TrainingApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import AvatarComponent from '../shared/Avatar';
import Message from '../../DTO/Message';
import UserContextMenu from '../shared/userComponents/UserContextMenu';
import DialogComponent from '../shared/Dialog';
import UserProfile from '../shared/userComponents/UserProfile';
import UserReport from '../shared/userComponents/UserReport';


const ChatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useContext(UserContext);
    const usersApi = new UsersApi();
    const chatsApi = new ChatsApi();
    const { privateChats, setPrivateChats, connected, message, setMessage, sendPrivateValue } = useWebSocket();
    const trainingsApi = new TrainingApi();
    const [tabId, setTabId] = useState(0);
    const [tabName, setTabName] = useState('');
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
    const lastMessageRef = useRef<HTMLLIElement | null>(null);
    const [userContextMenu, setUserContextMenu] = useState({top:0, left:0, show:false, userId:0, userFullName:''});
    const [clickedElement, setClickedElement] = useState<Message>(null);
    const [detailsUserDialogVisible,setDetailsUserDialogVisible] = useState(false);
    const [reportUserDialogVisible, setReportUserDialogVisible] = useState(false);

    useEffect(() => {
        const initializeChats = async () => {
            if (user.id && !connected) {
                await fetchChats(); 
                setPrivateChats((currentChats) => {
                    if (location.state && !currentChats.find(chat => chat.userId === location.state.trainerId)) {
                        selectUserToChat(location.state.trainerId, location.state.fullName);
                    }
                    else {
                        if(location.state)
                        {
                            setTabId(location.state.trainerId);
                            setTabName(location.state.fullName);
                            optionalFetchHistory(currentChats.find(chat => chat.userId === location.state.trainerId)?.id);
                        }
                    }
                    return currentChats;
                });
            }
        };
    
        initializeChats();
    }, [user.id]);
    

    useEffect(() => {
        const currentChat = privateChats.filter(chat => chat.userId === tabId);
        if(currentChat.length>0 && currentChat[0].messages && currentChat[0].messages.length>0)
        {
            currentChat[0].messages.map((message) => {
                if (message.trainingId) {
                    const existingPlan = findPlanById(message.trainingId);
                    if (!existingPlan) {
                        trainingsApi.TrainingPlanById(message.trainingId).then(resp => {
                            setTrainingPlans(prev => [...prev, resp]);
                        })
                    }
                }
            });
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    handleTurnOffNotification(privateChats.find(chat => chat.userId === tabId)!);
                }
            }, { threshold: 1.0 });
            if (lastMessageRef.current) {
                observer.observe(lastMessageRef.current);
            }
            scrollToBottom();
            return () => {
                if (lastMessageRef.current) {
                    observer.unobserve(lastMessageRef.current);
                }
            };
        }
        
    }, [privateChats, tabId]);

    const fetchChats = async() => {
        const resp = await chatsApi.UsersChats(user.id!);
        if(resp)
        {
            setPrivateChats(resp);
        }
    }

    const optionalFetchHistory = (optionalId:number|undefined) => {
        if(optionalId)
        {
            fetchChatMessages(optionalId);
        }
    }

    const fetchChatMessages = async(chatId:number) => {
        const resp = await chatsApi.MessagesHistory(chatId);
        if(resp)
        {
            setPrivateChats(prevChats => 
                prevChats.map(chat => 
                    chat.id === chatId 
                    ? { ...chat, messages: resp } 
                    : chat
                )
            );
        }
    }

    const handleMessage = (event) => {
        setMessage(event.target.value);
    };

    const selectUserToChat = (id:number, name:string) => {
        const existingChat = privateChats.find(chat => chat.userId === id);
        if (!existingChat) {
            const newChat = new Chat(id!, name!, '', []);
            setPrivateChats(prev => [...prev, newChat]);
        }
        setTabId(id!);
        setTabName(name!);
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

    const findPlanById = (id: number) => {
        return trainingPlans.find(plan => plan.id === id);
    };

    const handleCopyPlanToMyPlans = (trainingId: number) => {
        trainingsApi.CopyPlanAndSetUser(user.id!, trainingId).then(() => {
            navigate('/trainingPlan/usersPlans');
        })
    }

    const handleTurnOffNotification = (chat:Chat) => {
        chatsApi.turnOffNotivication(user.id!, chat.id!);
    }

    const scrollToBottom = () => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleContextMenuOnMessage = (e:MouseEvent, userId:number, userFullName:string, message:Message) => {
        e.preventDefault();
        setUserContextMenu({top:e.pageY, left:e.pageX, show:true, userId:userId, userFullName:userFullName});
        setClickedElement(message);
    }

    const hideUserContextMenu = () => {
        setUserContextMenu(prev => ({...prev, show:false}));
    }

    return (
        <div className="container">
            {userContextMenu.show && 
                <UserContextMenu 
                    closeContextMenu= {hideUserContextMenu}
                    top = {userContextMenu.top}
                    left = {userContextMenu.left}
                    userId = {userContextMenu.userId}
                    userFullName = {userContextMenu.userFullName}
                    showProfileFunc={() => {setDetailsUserDialogVisible(true);}}
                    showReportFunc={() => {setReportUserDialogVisible(true);}}
                    dontShowChatNav = {true}
                />
            }
            {detailsUserDialogVisible && 
                <DialogComponent level={1} closeDialogFunction={() => setDetailsUserDialogVisible(false)} moveUp={false}>
                    <UserProfile userId={userContextMenu.userId}/>
                </DialogComponent>
            }
            {reportUserDialogVisible && 
                    <DialogComponent level={1} closeDialogFunction={() => setReportUserDialogVisible(false)} moveUp={false}>
                        <UserReport 
                            senderId={user.id!} 
                            reportedId={userContextMenu.userId} 
                            reportedFullName={userContextMenu.userFullName} 
                            invalidCommunicate={clickedElement} 
                            communicateType={'MESSAGE'}
                            closeReportInterfaceFunction={() => setReportUserDialogVisible(false)}
                            />
                    </DialogComponent>
            }
            <div className="chat-box">
                <div className="member-list">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search user"
                />

                {loadingUsers && <p>Ładowanie...</p>}
                

                <ul>
                    {users.length === 0 && !loadingUsers && <p>No records</p>}
                    {users.map(user => (
                        <li key={user.id} onClick={() => {selectUserToChat(user.id!, user.name!); setSearchQuery(""); setUsers([])}}>
                            {user.name}
                        </li>
                    ))}
                </ul>
                    <ul>
                        {privateChats.map((chat, index) => (
                            <li
                                key={index}
                                onClick={() => { setTabName(chat.userName); setTabId(chat.userId); optionalFetchHistory(chat.id); handleTurnOffNotification(chat); chat.notification=false; }}
                                className={`member ${tabId === chat.userId ? 'active' : ''}`}
                            >
                                <AvatarComponent senderId={chat.userId} senderFullName={chat.userName}/>
                                <div className='chatHeaderNameDateWrapper'>
                                    <div className='chatHeaderName'>{chat.userName} {chat.notification && '🟠'}</div> 
                                    <div className='chatHeaderDate'>{chat.lastMessageDate}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="chat-content">
                <ul className="chat-messages">
                    {
                        privateChats
                            .filter(chat => chat.userId === tabId)
                            .map((chat) =>
                                (chat.messages || []).map((message, i) => (
                                    <li key={i} 
                                        className={`message ${message.senderId === user.id ? 'self' : ''}`} 
                                        ref={ i === (chat.messages.length - 1) ? lastMessageRef : null}
                                        onContextMenu={(e) => {handleContextMenuOnMessage(e, message.senderId, message.senderName, message)}}
                                        >
                                        {message.senderId !== user.id ? <div className="avatar"><AvatarComponent senderId={message.senderId} senderFullName={message.senderName}/></div> :
                                        <div className="avatar self"><AvatarComponent senderId={message.senderId} senderFullName={message.senderName}/></div>}
                                        <div className="message-data">
                                            {
                                                !message.trainingId ? 
                                                message.message:
                                                (
                                                    <div className={"plan"}>
                                                        <div className="plan-name">{findPlanById(message.trainingId)?.name}</div>
                                                        <div className="trainings-container">
                                                            {findPlanById(message.trainingId)?.trenings.map((training, trainingIndex) => (
                                                                <div key={trainingIndex} className={"training"}>
                                                                    <div className="training-name">{training.name}</div>
                                                                    <div className="exercises-container">
                                                                        {training.exercises.map((exercise, exerciseIndex) => (
                                                                            <div key={exerciseIndex} className={"exercise"}>
                                                                                <div className="exercise-name">{exercise.exercise.name}</div>
                                                                                <div className="exercise-parameters">{exercise.parameters}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {(
                                                            <button className='planActivationButton' onClick={() => handleCopyPlanToMyPlans(message.trainingId!)}>Add to my plans</button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </li>
                                ))
                            )
                    }
                </ul>
                    <div className="send-message">
                        <input
                            type="text"
                            className="input-message"
                            placeholder="enter the message"
                            value={message}
                            onChange={handleMessage}
                        />
                        { tabId != 0 && (<button
                            className="send-button"
                            onClick={() => sendPrivateValue(tabId, tabName)}
                        >
                            Send
                        </button>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
