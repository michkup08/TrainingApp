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

const ChatsPage = () => {
    const user = useContext(UserContext);
    const usersApi = new UsersApi();
    const chatsApi = new ChatsApi();
    const stompClientRef = useRef<Client>(null);
    const [privateChats, setPrivateChats] = useState<Chat[]>([]);
    const [tabId, setTabId] = useState(0);
    const [tabName, setTabName] = useState('');
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

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

    useEffect(() => {
        if (user.id && !connected) {
            fetchChats();
            connect();
        }
    }, [user.id]);

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

    const getInitials = (name:string) => {
        const parts = name.split(' ');
        return parts.map(part => part[0].toUpperCase()).join('');
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
                        <li key={user.id} onClick={() => selectUserToChat(user.id!, user.name!)}>
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
                                        <div className="message-data">{message.message}</div>
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
