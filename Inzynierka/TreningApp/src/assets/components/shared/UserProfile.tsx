import { useContext, useEffect, useState } from "react";
import { TrainerApi } from "../../service/TrainerApi";
import { UsersApi } from "../../service/UsersApi"
import User from "../../DTO/User";
import TrainerProfile from "../../DTO/TrainerProfile";
import '../../css/UserProfile.css'
import { useNavigate } from "react-router-dom";
import { PostsApi } from "../../service/PostsApi";
import Post from "../../DTO/Post";
import AvatarComponent from "./Avatar";
import { UserContext } from "../../context/UserContext";

function UserProfile({userId}:{userId:number}) {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const usersApi = new UsersApi();
    const postsApi = new PostsApi();
    const trainersApi = new TrainerApi();
    const [userProfile, setUserProfile] = useState<User>();
    const [trainer, setTrainer] = useState<TrainerProfile>();
    const [profileImage, setProfileImage] = useState('');
    const [page, setPage] = useState(0);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [commentMessage, setCommandMessage] = useState('');

    useEffect(() => {
        usersApi.fetchProfileImage(userId).then((image) => {
            setProfileImage(image);
        })

        usersApi.userById(userId).then((u) => {
            console.log(u);
            setUserProfile(u);
            if(u.role==='TRAINER')
            {
                trainersApi.trainerProfile(userId).then((t) => {
                    setTrainer(t);
                })
            }
        });

    }, [])

    useEffect(() => {
        setLoading(true);
        postsApi.getUsersPostsList(page, userId).then((p) => {
            setPosts(p);
        })
        setLoading(false);
    }, [page])

    const handleStartChat = (trainerId:number, fullName:string) => {
        navigate('/chats', { state: { trainerId, fullName } });
    };

    const handleLoadMoreComments = (postClicked:Post) => {

        postsApi.getCommentsList(postClicked.commentsPage, postClicked.id).then((resp) => {
            resp=resp.reverse();
            setPosts((prevPosts) => 
                prevPosts.map((post) => {
                    return post.id === postClicked.id ? { 
                        ...post, 
                        commentsPage: postClicked.commentsPage + 1, 
                        comments: [...resp,...post.comments]
                    } : post}
                )
            )
        })
    };

    const getInitials = (name:string) => {
        const parts = name.split(' ');
        return parts.map(part => part[0].toUpperCase()).join('');
    }

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleLike = (postClicked: &Post) => {
        postsApi.likeDislikePost(postClicked.id, user.id!).then(() => {
            setPosts((prevPosts) => 
                prevPosts.map((post) =>
                    post === postClicked ? { ...post, liked: !post.liked, likes: postClicked.liked ? post.likes - 1 : post.likes + 1 } : post
            )
        )})
    }

    const handleSendComment = (postClicked: Post) => {
        if(commentMessage.length > 0)
        {
            postsApi.sendComment(postClicked.id, user, commentMessage).then(() => {
                setPosts((prevPosts) => 
                    prevPosts.map((post) => {
                        return post.id === postClicked.id ? {
                            ...post, 
                            comments: [...post.comments, {id: 0, senderId: user.id!, senderName: user.name!, senderSurname: user.surname!, postId: postClicked.id, content:commentMessage}]
                        } : post}
                    )
                )
                setCommandMessage('');
            })
        }
    }

    const handleCommentsActivaton = (postClicked: &Post) => {
        setPosts((prevPosts) => 
            prevPosts.map((post) =>
                post === postClicked ? { ...post, showComments: !postClicked.showComments } : post
        ))
        if(!postClicked.comments || postClicked.comments.length==0) {
            postsApi.getCommentsList(postClicked.commentsPage || 0, postClicked.id).then((resp) => {
                resp=resp.reverse();
                setPosts((prevPosts) => 
                    prevPosts.map((post) => {
                        return post.id === postClicked.id ? { 
                            ...post, 
                            commentsPage: postClicked.commentsPage + 1, 
                            comments: resp
                        } : post}
                    )
                )
            })
        }
    }

    return (
        <div>
            {userProfile && 
                <div className='userProfileWrapper'>
                    <div className="trainer-card">
                        <div className="profilePictureContainer">
                            <img 
                                src={`${profileImage ? profileImage : 'images/user-avatar.png'}`} 
                                alt="Post image" 
                                className="post-image"
                            />
                        </div>
                        <div className="trainer-header">
                            <div className="trainerNameAndButtons">
                                <span className="username">{userProfile.name + ' ' + userProfile.surname}</span>
                                <button className="chatBtn" onClick={() => {handleStartChat(userProfile.id!, userProfile.name + ' ' + userProfile.surname);}}>
                                    <svg height="1.6em" fill="white" viewBox="0 0 1000 1000" y="0px" x="0px" version="1.1">
                                    <path d="M881.1,720.5H434.7L173.3,941V720.5h-54.4C58.8,720.5,10,671.1,10,610.2v-441C10,108.4,58.8,59,118.9,59h762.2C941.2,59,990,108.4,990,169.3v441C990,671.1,941.2,720.5,881.1,720.5L881.1,720.5z M935.6,169.3c0-30.4-24.4-55.2-54.5-55.2H118.9c-30.1,0-54.5,24.7-54.5,55.2v441c0,30.4,24.4,55.1,54.5,55.1h54.4h54.4v110.3l163.3-110.2H500h381.1c30.1,0,54.5-24.7,54.5-55.1V169.3L935.6,169.3z M717.8,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.5,24.7,54.5,55.2C772.2,420.2,747.8,444.8,717.8,444.8L717.8,444.8z M500,444.8c-30.1,0-54.4-24.7-54.4-55.1c0-30.4,24.3-55.2,54.4-55.2c30.1,0,54.4,24.7,54.4,55.2C554.4,420.2,530.1,444.8,500,444.8L500,444.8z M282.2,444.8c-30.1,0-54.5-24.7-54.5-55.1c0-30.4,24.4-55.2,54.5-55.2c30.1,0,54.4,24.7,54.4,55.2C336.7,420.2,312.3,444.8,282.2,444.8L282.2,444.8z"></path>
                                    </svg>
                                    <span className="tooltip">Chat</span>
                                </button>
                            </div>
                            <div className='userDetails'>
                                <div className='userDetail'>
                                    {userProfile.role?.toLocaleLowerCase()}
                                </div >
                                <div className='userDetail'>
                                    {userProfile.email}
                                </div> 
                            </div>
                            {userProfile.role==='TRAINER' && trainer && <div className="trainer-info">
                                <div className="trainerDescriptionsWrapper">
                                    <h4>{trainer.description}</h4>
                                </div>
                                <div className="trainerAvailabilityWrapper">
                                    <h4>{trainer.availability}</h4>
                                </div>
                                <div className="trainerPriceWrapper">
                                    <h4>{trainer.price}</h4>
                                </div>
                            </div>}
                            
                        </div>
                        
                    </div>
                    {posts.map((post:Post, index:number) => (
                        <div key={index} className="post-card">
                            <div className="post-header">
                                {<AvatarComponent senderId={post.senderId} senderFullName={post.senderFullName}/>}
                                <div className="post-info">
                                    <span className="username">{post.senderFullName}</span>
                                    <span className="post-time">{post.dateTime}</span>
                                    
                                </div>
                            </div>
                            <div className="postContextWrapper">
                                <h4>{post.context}</h4>
                            </div>
                            {post.image && (<img 
                                src={`data:image/jpeg;base64,${post.image}`} 
                                alt="Post image" 
                                className="post-image"
                            />)}
                            <div className="post-actions">
                                {userProfile.id && <button className="like-btn" onClick={() => handleLike(post)} style={{backgroundColor: post.liked ? "white" : "grey"}}>{post.liked ? "❤️":"🖤"}</button>}
                                <button className="comment-btn" onClick={() => handleCommentsActivaton(post)} style={{backgroundColor: post.showComments ? "white" : "grey"}}>💬</button>
                            </div>
                            <div className="post-details">
                                <span className="likes">{post.likes} likes</span>
                            </div>
                            {post.showComments && (
                                <>
                                    <ul className="chat-messages">
                                        {post.comments.map((comment, i) => (
                                            <li key={i} className={`message ${comment.senderId === userProfile.id ? 'self' : ''}`}>
                                                {comment.senderId !== userProfile.id ? <AvatarComponent senderId={comment.senderId} senderFullName={comment.senderName + ' ' + comment.senderSurname}/> :
                                                    <div className="avatar self">{getInitials(comment.senderName + ' ' + comment.senderSurname)}</div>}
                                                <div className="message-data">
                                                    {comment.content}
                                                </div>
                                            </li>
                                        ))}
                                        {post.comments.length > 0 ? <button onClick={() => handleLoadMoreComments(post)} disabled={loading} className="load-more-btn">
                                            {loading ? 'Loading...' : 'More comments'}
                                        </button> : 
                                        <div className="message-data">
                                            No comments            
                                        </div>}
                                    </ul>
                                    {userProfile.id && <div className="send-message">
                                        <input
                                            type="text"
                                            className="input-message"
                                            placeholder="enter the command"
                                            value={commentMessage}
                                            onChange={(e) => {setCommandMessage(e.target.value)}}
                                            style={{backgroundColor: "#3a3b3c"}}
                                        />
                                        <button
                                            className="send-button"
                                            onClick={() => handleSendComment(post)}>
                                            Send
                                        </button>
                                    </div>}
                                </>
                            )}
                        </div>
                    ))}
                </div>
                
            }
        </div>
        
    )
}

export default UserProfile
