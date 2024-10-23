import PostsComment from "./Comment";
import Message from "./Message";
import Post from "./Post";

export default interface Report {
    id?: number;
    senderId: number;
    reportedId: number;
    reportedFullName: string;
    description: string;
    checked: boolean;
    communicateType: 'POST' | 'COMMENT' | 'MESSAGE';
    communicateId: number;
    invalidCommentDTO: PostsComment;
    invalidMessageDTO: Message;
    invalidPostDTO: Post;
}