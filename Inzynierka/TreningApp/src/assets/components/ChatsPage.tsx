import { useContext, useEffect, useRef, useState } from 'react';
import './init';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { UserContext } from '../context/UserContext';
import Chat from '../DTO/Chat';
import { UsersApi } from '../service/UsersApi';
import User from '../DTO/User';
import { ChatsApi } from '../service/ChatsApi';
import '../css/Chats.css'
import { useLocation } from 'react-router-dom';
import TrainingPlan from '../DTO/TrainingPlan';
import { TrainingApi } from '../service/TrainingApi';

const ChatsPage = () => {
    const location = useLocation();
    const user = useContext(UserContext);
    const usersApi = new UsersApi();
    const chatsApi = new ChatsApi();
    const trainingsApi = new TrainingApi();
    const stompClientRef = useRef<Client>(null);
    const [privateChats, setPrivateChats] = useState<Chat[]>([]);
    const [tabId, setTabId] = useState(0);
    const [tabName, setTabName] = useState('');
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);

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
    
                connect();
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

    const connect = () => {
        if (!stompClientRef.current) {
            const Sock = new SockJS('http://localhost:8080/trainingappdb/ws');
            const stomp = over(Sock);
            stomp.connect({}, () => onConnected(stomp), onError);
            stompClientRef.current = stomp;
        }
    };

    const onConnected = (stomp:Client) => {
        setConnected(true);
        stomp.subscribe(`/user/${user.id}/private`, onPrivateMessage);
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (payloadData.status === 'JOIN') {
            if (!privateChats.find(chat => chat.userId === payloadData.senderId)) {
                setPrivateChats(prev => [...prev, new Chat(payloadData.senderId, payloadData.senderName, '', [])]);
            }
        }
        else {
            setPrivateChats(prevChats => {
                const existingChat = prevChats.find(chat => chat.userId === payloadData.senderId);
                if (existingChat) {
                    
                    const updatedChats = prevChats.map(chat =>
                        chat.userId === payloadData.senderId
                            ? { ...chat, messages: [...chat.messages, payloadData] }
                            : chat
                    );
                    return updatedChats;
                } else {
                    const newChat = new Chat(payloadData.senderId, payloadData.senderName, '', [payloadData]);
                    return [...prevChats, newChat];
                }
            });
        }
        
    };

    const onError = (err:Error) => {
        console.error('WebSocket Error:', err);
        connect();
    };

    const handleMessage = (event) => {
        setMessage(event.target.value);
    };

    const sendPrivateValue = () => {
        if (stompClientRef.current && message.trim()) {
            const chatMessage = {
                senderId: user.id,
                senderName: `${user.name} ${user.surname}`,
                receiverName: tabName,
                receiverId: tabId,
                message: message,
                status: 'MESSAGE'
            };
    
            if(tabId !== user.id)
            {
                setPrivateChats(prevChats => {
                    const updatedChats = prevChats.map(chat =>
                        chat.userId === tabId
                            ? { ...chat, messages: [...chat.messages, chatMessage] }
                            : chat
                    );
                    return updatedChats;
                });
            }
            stompClientRef.current.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    const selectUserToChat = (id:number, name:string) => {
        const existingChat = privateChats.find(chat => chat.userId === id);
        console.log(privateChats);
        if (!existingChat) {
            const newChat = new Chat(id!, name!, '', []);
            
            setPrivateChats(prev => [...prev, newChat]);
            console.log(newChat);
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

    const getInitials = (name:string) => {
        const parts = name.split(' ');
        return parts.map(part => part[0].toUpperCase()).join('');
    }

    const findPlanById = (id: number) => {
        return trainingPlans.find(plan => plan.id === id);
    };

    const handleCopyPlanToMyPlans = (trainingId: number) => {
        trainingsApi.CopyPlanAndSetUser(user.id!, trainingId);
    }

    return (
        <div className="container">
            <div className="chat-box">
                <div className="member-list">
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Search user"
                />

                {loadingUsers && <p>Ładowanie...</p>}
                

                <ul>
                    {users.length === 0 && !loadingUsers && <p>No records</p>}
                    {users.map(user => (
                        <li key={user.id} onClick={() => selectUserToChat(user.id!, user.name!)}>{/*that select user works correctly, and don't make duplicates*/}
                            {user.name}
                        </li>
                    ))}
                </ul>
                    <ul>
                        {privateChats.map((chat, index) => (
                            <li
                                key={index}
                                onClick={() => { setTabName(chat.userName); setTabId(chat.userId); optionalFetchHistory(chat.id) }}
                                className={`member ${tabId === chat.userId ? 'active' : ''}`}
                            >
                                {chat.userName}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="chat-content">
                <ul className="chat-messages">
                    {
                        privateChats
                            .filter(chat => chat.userId === tabId)
                            .map((chat, index) =>
                                (chat.messages || []).map((message, i) => (
                                    <li key={i} className={`message ${message.senderId === user.id ? 'self' : ''}`}>
                                        {message.senderId !== user.id ? <div className="avatar">{getInitials(message.senderName)}</div> :
                                        <div className="avatar self">{getInitials(message.senderName)}</div>}
                                        <div className="message-data">
                                            {!message.trainingId ? 
                                                message.message :
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
                                                            <button className='planActivationButton' onClick={() => handleCopyPlanToMyPlans(message.trainingId)}>Add to my plans</button>
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
                            onClick={sendPrivateValue}
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
