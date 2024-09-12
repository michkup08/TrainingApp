import Message from "./Message";

export default class Chat {
    id?: number;
    userId: number;
    userName: string;
    lastMessageDate: string;
    messages: Message[];

    constructor(
        userId: number,
        userName: string,
        lastMessageDate: string,
        messages: Message[]
    ) {
        this.userId = userId,
        this.userName = userName,
        this.lastMessageDate = lastMessageDate,
        this.messages = messages
    }
}