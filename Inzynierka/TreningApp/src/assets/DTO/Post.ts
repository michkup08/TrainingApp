export default interface Post {
    id: number;
    senderId: number;
    senderFullName: string;
    context: string;
    likes: number;
    liked: boolean;
    date: string;
    image: string;
}