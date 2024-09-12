import axios from "axios";
import Chat from "../DTO/Chat";
import Message from "../DTO/Message";

export const axiosInstance= axios.create();

export class ChatsApi {
    baseURL: string = "http://localhost:8080/trainingappdb/chats";

    UsersChats = async (loggedUserId:number): Promise<Chat[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/chatsSimplified/${loggedUserId}`);
        const chatsData = resp.data;
        const chats: Chat[] = chatsData.map((chat) => ({
            id: chat.id,
            userId: loggedUserId === chat.user1Id ? chat.user2Id : chat.user1Id,
            userName: loggedUserId === chat.user1Id ? chat.user2Name : chat.user1Name,
            lastMessageDate: chat.lastMessageDate
        }))

        return chats;
    }

    MessagesHistory = async (chatId:number): Promise<Message[]> => {
        const resp = await axiosInstance.get(this.baseURL + `/messagesHistory/${chatId}`);
        const messagesData = resp.data;
        const messages: Message[] = messagesData.map((message) => ({
            senderId: message.senderId,
            senderName: message.senderName,
            receiverId: message.receiverId,
            receiverName: message.receiverName,
            message: message.message,
            date: message.date
        }))
        console.log(messages);
        return messages;
    }
}