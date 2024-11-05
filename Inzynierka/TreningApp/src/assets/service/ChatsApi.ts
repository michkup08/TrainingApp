import axios from "axios";
import Chat from "../DTO/Chat";
import Message from "../DTO/Message";

export const axiosInstance= axios.create();

export class ChatsApi {
    baseURL: string = `${import.meta.env.VITE_BACKEND_LINK}/trainingappdb/chats`;

    parseDateTime = (dateTimeStr:string): Date => {
        const [day, month, year, time] = dateTimeStr.split(/[- ]/);
        return new Date(`${year}-${month}-${day}T${time}`);
    };

    UsersChats = async (loggedUserId:number): Promise<Chat[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/chatsSimplified/${loggedUserId}`);
        const chatsData = resp.data;
        const chats: Chat[] = chatsData.map((chat) => ({
            id: chat.id,
            userId: loggedUserId === chat.user1Id ? chat.user2Id : chat.user1Id,
            userName: loggedUserId === chat.user1Id ? chat.user2Name : chat.user1Name,
            lastMessageDate: chat.lastMessageDate,
            notification: loggedUserId === chat.user1Id ? chat.user1Notification : chat.user2Notification,
        }))
        return chats.sort((a,b) => {
            return this.parseDateTime(b.lastMessageDate).getTime() - this.parseDateTime(a.lastMessageDate).getTime();
        })
    }

    turnOffNotivication = async (loggedUserId:number, chatId:number) => {
        await axiosInstance.put(this.baseURL + `/turnOffNotivication`, {
            objectId: chatId,
            userId: loggedUserId
        });
        
    }

    MessagesHistory = async (chatId:number): Promise<Message[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/messagesHistory/${chatId}`);
        const messagesData = resp.data;
        const messages: Message[] = messagesData.map((message) => ({
            id: message.id,
            senderId: message.senderId,
            senderName: message.senderName,
            receiverId: message.receiverId,
            receiverName: message.receiverName,
            message: message.message,
            date: message.date,
            trainingId: message.trainingId
        }))
        return messages;
    }
}