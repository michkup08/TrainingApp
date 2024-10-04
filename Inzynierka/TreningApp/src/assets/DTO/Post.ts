import PostsComment from "../DTO/Comment";

export default interface Post {
    id: number;
    senderId: number;
    senderFullName: string;
    context: string;
    likes: number;
    liked: boolean;
    dateTime: string;
    image: string;
    showComments: boolean;
    comments: PostsComment[];
    commentsPage: number;
}