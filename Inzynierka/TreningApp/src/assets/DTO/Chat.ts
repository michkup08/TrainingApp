import Message from "./Message";

export default class Chat {
    id?: number;
    userId: number;
    userName: string;
    lastMessageDate: string;
    messages: Message[];
    notification: boolean;

    constructor(
        userId: number,
        userName: string,
        lastMessageDate: string,
        messages: Message[],
        notification?: boolean
    ) {
        this.userId = userId,
        this.userName = userName,
        this.lastMessageDate = lastMessageDate,
        this.messages = messages
        this.notification = notification || false
    }
}