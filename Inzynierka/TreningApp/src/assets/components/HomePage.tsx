import "./init";
import { useState, useEffect, useContext } from 'react';
import '../css/HomePage.css'; // Import stylizacji
import Post from "../DTO/Post";
import { PostsApi } from "../service/PostsApi";
import { UserContext } from "../context/UserContext";

const PostsList = () => {
    const user = useContext(UserContext);
    const postsApi = new PostsApi();
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newPostText, setNewPostText] = useState('');

    const fetchPosts = async () => {
        if(user && user.id)
        {
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
        }
        
    };

    useEffect(() => {
        fetchPosts();
    }, [page, user]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
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
        <div className="posts-container">
            {user.id!=0 && <div className="post-card">
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
            </div>}
            {posts.map((post:Post, index:number) => (
                <div key={index} className="post-card">
                    <div className="post-header">
                    <div className="avatar">{getInitials(post.senderFullName)}</div>
                        <div className="post-info">
                            <span className="username">{post.senderFullName}</span>
                            <span className="post-time">{post.time}</span>
                            
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
                        <button className="like-btn" onClick={() => handleLike(post)} style={{backgroundColor: post.liked ? "white" : "grey"}}>{post.liked ? "❤️":"🖤"}</button>
                        <button className="comment-btn" onClick={() => handleCommentsActivaton(post)} style={{backgroundColor: post.showComments ? "white" : "grey"}}>💬</button>
                    </div>
                    <div className="post-details">
                        <span className="likes">{post.likes} likes</span>
                    </div>
                    {post.showComments && (
                        <ul className="chat-messages">
                            {post.comments.map((comment, i) => (
                                <li key={i} className={`message ${comment.senderId === user.id ? 'self' : ''}`}>
                                    {comment.senderId !== user.id ? <div className="avatar">{getInitials(comment.senderName + ' ' + comment.senderSurname)}</div> :
                                        <div className="avatar self">{getInitials(comment.senderName + ' ' + comment.senderSurname)}</div>}
                                    <div className="message-data">
                                        {comment.content}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'More posts'}
            </button>
        </div>
    );
};

export default PostsList;
