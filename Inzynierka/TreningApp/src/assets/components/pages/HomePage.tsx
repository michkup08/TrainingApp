import "../init";
import { useState, useEffect, useContext } from 'react';
import '../../css/HomePage.css'; // Import stylizacji
import Post from "../../DTO/Post";
import { PostsApi } from "../../service/PostsApi";
import { UserContext } from "../../context/UserContext";
import AvatarComponent from "../shared/Avatar";
import UserContextMenu from "../shared/UserContextMenu";
import DialogComponent from "../shared/Dialog";
import UserProfile from "../shared/UserProfile";

const PostsList = () => {
    const user = useContext(UserContext);
    const postsApi = new PostsApi();
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newPostText, setNewPostText] = useState('');
    const [commentMessage, setCommandMessage] = useState('');
    const [userContextMenu, setUserContextMenu] = useState({top:0, left:0, show:false, userId:0, userFullName:''});
    const [detailsUserDialogVisible,setDetailsUserDialogVisible] = useState(false);

    const fetchPosts = async () => {
        
        setLoading(true);
        const newPosts = await postsApi.getPostsList(page, user.id!);
        if(page!=0)
        {
            setPosts(prevPosts => [...prevPosts, ...newPosts]);
        }
        else
        {
            setPosts(newPosts);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [page, user]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
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

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid image file.");
        }
    };

    const getFileExtension = (file: File): string => {
        const fileNameParts = file.name.split('.');
        return fileNameParts[fileNameParts.length - 1];
    };

    const handleAddNewPost = async() => {
        if(user.id && newPostText)
        {
            const postId:number = await postsApi.addPost({senderId: user.id!, context: newPostText});
            if(postId && selectedImage)
            {
                const formData = new FormData();
                const renamedFile = new File([selectedImage], `${postId}.${getFileExtension(selectedImage)}`);
                formData.append("file", renamedFile);
                const imageResp = await postsApi.postImageUpload(formData);
                if(imageResp)
                {
                    setNewPostText('');
                    setNewImageUrl(null);
                    setSelectedImage(null);
                    return;
                }
            }
            if(postId)
            {
                setNewPostText('');
                return;
            }
        }
        console.log("fail postiong post");
    }

    const handleLike = (postClicked: &Post) => {
        postsApi.likeDislikePost(postClicked.id, user.id!).then(() => {
            setPosts((prevPosts) => 
                prevPosts.map((post) =>
                    post === postClicked ? { ...post, liked: !post.liked, likes: postClicked.liked ? post.likes - 1 : post.likes + 1 } : post
            )
        )})
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

    const handleContextMenu = (e:MouseEvent, userId:number, userFullName:string) => {
        e.preventDefault();
        setUserContextMenu({top:e.pageY, left:e.pageX, show:true, userId:userId, userFullName:userFullName});
    }

    const hideUserContextMenu = () => {
        setUserContextMenu(prev => ({...prev, show:false}));
    }

    return (
        <div className='postsPageWrapper'>
            {userContextMenu.show && 
                <UserContextMenu 
                    closeContextMenu= {hideUserContextMenu}
                    top = {userContextMenu.top}
                    left = {userContextMenu.left}
                    userId = {userContextMenu.userId}
                    userFullName = {userContextMenu.userFullName}
                    showProfileFunc={() => {setDetailsUserDialogVisible(true);}}
                />
            }
            {detailsUserDialogVisible && 
                (
                    <>
                        <div className='portal_background' onClick={() => setDetailsUserDialogVisible(false)}/>
                        <DialogComponent level={1}>
                            <UserProfile userId={userContextMenu.userId}/>
                        </DialogComponent>
                    </>
                )}
            <div className="posts-container">
                {user.id && <div className="post-card">
                    <div className="post-header">
                        <div className="avatar">+</div>
                            <div className="post-info">
                                <span className="username">Add new post</span>
                            </div>
                        </div>
                        <div className="postContextWrapper">
                            <textarea 
                                name="multi-row"
                                placeholder="Write your post"
                                value={newPostText}
                                onChange={e => setNewPostText(e.target.value)}
                            />
                        </div>
                        <input type="file" accept="image/*" id="fileInput" onChange={handleImageSelect} style={{ display: 'none' }} />
                        <label htmlFor="fileInput" className="custom-file-upload">
                            Choose Image
                        </label>
                        {newImageUrl && <img 
                            src={newImageUrl}
                            className="post-image"
                        />}
                        <button className="sendPostButton" onClick={handleAddNewPost}>Send</button>
                    </div>
                }
                {posts.map((post:Post, index:number) => (
                    <div key={index} className="post-card">
                        <div className="post-header"  onContextMenu={(e) => {handleContextMenu(e, post.senderId, post.senderFullName)}}>
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
                            {user.id && <button className="like-btn" onClick={() => handleLike(post)} style={{backgroundColor: post.liked ? "white" : "grey"}}>{post.liked ? "❤️":"🖤"}</button>}
                            <button className="comment-btn" onClick={() => handleCommentsActivaton(post)} style={{backgroundColor: post.showComments ? "white" : "grey"}}>💬</button>
                        </div>
                        <div className="post-details">
                            <span className="likes">{post.likes} likes</span>
                        </div>
                        {post.showComments && (
                            <>
                                <ul className="chat-messages">
                                    {post.comments.map((comment, i) => (
                                        <li key={i} className={`message ${comment.senderId === user.id ? 'self' : ''}`}>
                                            {comment.senderId !== user.id ? <AvatarComponent senderId={comment.senderId} senderFullName={comment.senderName + ' ' + comment.senderSurname}/> :
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
                                {user.id && <div className="send-message">
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
                <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                    {loading ? 'Loading...' : 'More posts'}
                </button>
            </div>
        </div>
    );
};

export default PostsList;
