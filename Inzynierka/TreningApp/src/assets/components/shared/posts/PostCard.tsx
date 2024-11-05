import React from 'react';
import AvatarComponent from "../../shared/Avatar";
import CommentList from "./CommentList";
import Post from '../../../DTO/Post';
import { PostsApi } from "../../../service/PostsApi";
import { ContextMenu, State } from './PostTypes';
import User from '../../../DTO/User';

const postsApi = new PostsApi();

interface PostCardProps {
    post: Post;
    user: User;
    setState: React.Dispatch<React.SetStateAction<State>>;
    setContextMenu: React.Dispatch<React.SetStateAction<ContextMenu>>;
}

const PostCard: React.FC<PostCardProps> = React.memo(({ post, user, setState, setContextMenu }) => {
    const handleLike = () => {
        postsApi.likeDislikePost(post.id, user.id!).then(() => {
            setState(prev => ({
                ...prev,
                posts: prev.posts.map(p => p === post ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
            }));
        });
    };

    const toggleComments = () => {
        setState(prev => ({
            ...prev,
            posts: prev.posts.map(p => p === post ? { ...p, showComments: !p.showComments } : p)
        }));
    };

    const handleContextMenuOnPost = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        setContextMenu({top:e.pageY, left:e.pageX, show:true, userId:post.senderId, userFullName:post.senderFullName, clickedElement:post, clickedElementType:'POST'});
    }

    return (
        <div className="post-card">
            <div className="post-header" onContextMenu={(e) => {handleContextMenuOnPost(e)}}>
                <AvatarComponent senderId={post.senderId} senderFullName={post.senderFullName} />
                <div className="post-info">
                    <span className="username">{post.senderFullName}</span>
                    <span className="post-time">{post.dateTime}</span>
                </div>
            </div>
            <div className="postContextWrapper"><h4>{post.context}</h4></div>
            {post.image && <img src={`data:image/jpeg;base64,${post.image}`} alt="Post image" className="post-image" />}
            <div className="post-actions">
                {user.id != 0 && user.id && <button className="like-btn" onClick={handleLike}>{post.liked ? "❤️" : "🖤"}</button>}
                <button className="comment-btn" onClick={toggleComments}>💬</button>
            </div>
            <div className="post-details"><span className="likes">{post.likes} likes</span></div>
            {post.showComments && <CommentList postId={post.id} user={user} setState={setState} comments={post.comments} setContextMenu={setContextMenu}/>}
        </div>
    );
});

export default PostCard;
