export default interface PostsComment {
    id: number;
    senderId: number;
    senderName: string;
    senderSurname: string;
    postId: number;
    content: string;
}