import { useContext, useEffect, useRef, useState } from 'react';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { UserContext } from '../context/UserContext';
import Chat from '../DTO/Chat';

export const useWebSocket = () => {
    const user = useContext(UserContext);
    const stompClientRef = useRef<Client | null>(null);
    const [privateChats, setPrivateChats] = useState<Chat[]>([]);
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [navNotification, setNavNotivication] = useState(false);

    useEffect(() => {
        if (user.id && !connected) {
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

    const onConnected = (stomp: Client) => {
        setConnected(true);
        stomp.subscribe(`/user/${user.id}/private`, onPrivateMessage);
    };

    const onPrivateMessage = (payload: any) => {
        const payloadData = JSON.parse(payload.body);
        setNavNotivication(true);
        setPrivateChats(prevChats => {
            const existingChat = prevChats.find(chat => chat.userId === payloadData.senderId);
            if (existingChat) {
                return prevChats.map(chat =>
                    chat.userId === payloadData.senderId
                        ? { ...chat, messages: [...chat.messages, payloadData] }
                        : chat
                );
            } else {
                const newChat = new Chat(payloadData.senderId, payloadData.senderName, '', [payloadData]);
                return [...prevChats, newChat];
            }
        });
    };

    const onError = (err: Error) => {
        console.error('WebSocket Error:', err);
        connect();
    };

    const sendPrivateValue = (tabId: number, tabName: string, trainingId?:number|undefined) => {
        if (stompClientRef.current && (message.trim() || trainingId)) {
            const chatMessage = trainingId ? {
                senderId: user.id,
                senderName: `${user.name} ${user.surname}`,
                receiverName: tabName,
                receiverId: tabId,
                trainingId: trainingId,
                status: 'MESSAGE'
            } : {
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
                    return prevChats.map(chat =>
                        chat.userId === tabId
                            ? { ...chat, messages: [...chat.messages, chatMessage] }
                            : chat
                    );
                });
            }
            stompClientRef.current.send('/app/private-message', {}, JSON.stringify(chatMessage));
            setMessage('');
        }
    };

    return {
        privateChats,
        setPrivateChats,
        connected,
        message,
        setMessage,
        sendPrivateValue,
        connect,
        navNotification,
        setNavNotivication
    };
};