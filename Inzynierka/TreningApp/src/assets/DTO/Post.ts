export default interface Post {
    id: number;
    senderId: number;
    senderFullName: string;
    context: string;
    likes: number;
    date: string;
    image: string;
}