import React, { useState, ChangeEvent, useEffect } from 'react';
import { PostsApi } from "../../../service/PostsApi";
import { ContextMenu, State } from './PostTypes';
import Post from '../../../DTO/Post';
import PostsComment from '../../../DTO/Comment';
import User from '../../../DTO/User';
import AvatarComponent from '../Avatar';
import { getInitials } from '../../../utils/StringFunc';


const postsApi = new PostsApi();

interface CommentsListProps {
    comments: PostsComment[];
    postId: number;
    user: User;
    setState: React.Dispatch<React.SetStateAction<State>>;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenu>>;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, postId, user, setState, setContextMenu }) => {
    const [newCommentText, setNewCommentText] = useState<string>('');
    const [commentsPage, setCommentsPage] = useState(0);
    const [commentsList, setCommentsList] = useState(comments);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleCommentsActivaton();
    }, [])

    const handleCommentsActivaton = () => {
        
        if(!comments || comments.length==0) {
            postsApi.getCommentsList(commentsPage, postId).then((resp) => {
                resp = resp.reverse();
                setCommentsPage(commentsPage + 1),
                setCommentsList(resp);
            })
        }
    }

    const handleAddComment = async () => {
        if (!newCommentText) return;
        setLoading(true);
        await postsApi.sendComment(postId, user, newCommentText);
        setState(prev => ({
            ...prev,
            posts: prev.posts.map((post: Post) => {
                return post.id === postId ? {
                    ...post, 
                    comments: [...post.comments, {id: 0, senderId: user.id!, senderName: user.name!, senderSurname: user.surname!, postId: postId, content:newCommentText}]
                } : post}
            ),
        }));
        setCommentsList([...commentsList, {id: 0, senderId: user.id!, senderName: user.name!, senderSurname: user.surname!, postId: postId, content:newCommentText}]);
        setNewCommentText('');
        setLoading(false);
    };

    const handleLoadMoreComments = () => {

        postsApi.getCommentsList(commentsPage, postId).then((resp) => {
            resp=resp.reverse();
            setCommentsPage(commentsPage + 1);
            setCommentsList([...resp,...commentsList])
        })
    };

    const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewCommentText(e.target.value);
    };

    const handleContextMenuOnComment = (e:React.MouseEvent<HTMLLIElement, MouseEvent>, comment: PostsComment) => {
        e.preventDefault();
        setContextMenu({
            top: e.pageY, 
            left: e.pageX, 
            show: true, 
            userId: comment.senderId, 
            userFullName: comment.senderName + ' ' + comment.senderSurname, 
            clickedElement: comment, 
            clickedElementType: 'COMMENT'
        });
    }

    return (
        <div className="comments-section">
            <ul className="chat-messages">
                {commentsList.map((comment, i) => (
                    <li key={i} className={`message ${comment.senderId === user.id ? 'self' : ''}`} onContextMenu={(e) => {handleContextMenuOnComment(e, comment)}}>
                        {comment.senderId !== user.id ? 
                            <AvatarComponent senderId={comment.senderId} senderFullName={comment.senderName + ' ' + comment.senderSurname}/> :
                            <div className="avatar self">{getInitials(comment.senderName + ' ' + comment.senderSurname)}</div>
                        }
                        <div className="message-data">{comment.content}</div>    
                    </li>
                ))}
                {commentsList.length > 0 ? 
                    <button onClick={() => handleLoadMoreComments()} disabled={loading} className="load-more-btn">
                        {loading ? 'Loading...' : 'More comments'}
                    </button> : 
                    <div className="message-data">
                        No comments            
                    </div>
                }
            </ul>
            {user.id && user.id != 0 && <div className="send-message">
                <input
                    type="text"
                    value={newCommentText}
                    className="input-message"
                    onChange={handleCommentChange}
                    placeholder="Write a comment..."
                />
                <button 
                    onClick={handleAddComment}
                    className='send-button'
                    >Send</button>
            </div>}
        </div>
    );
};

export default CommentsList;
