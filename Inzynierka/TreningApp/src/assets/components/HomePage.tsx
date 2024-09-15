import "./init";
import React, { useState, useEffect, useContext } from 'react';
import '../css/HomePage.css'; // Import stylizacji
import Post from "../DTO/Post";
import { PostsApi } from "../service/PostsApi";
import { UserContext } from "../context/UserContext";

const PostsList = () => {
    const user = useContext(UserContext);
    const postsApi = new PostsApi();
    const [posts, setPosts] = useState<Post>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newPostText, setNewPostText] = useState('');

    const fetchPosts = async () => {
        setLoading(true);
        const newPosts = await postsApi.getPostsList([], 10);
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

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

            // Generate a preview URL for the selected image
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
                    setNewImageUrl(null);
                    setSelectedImage(null);
                    console.log("succes postiong post with image");
                    return;
                }
            }
            if(postId)
            {
                console.log("success posting post");
                return;
            }
        }
        console.log("fail postiong post");
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
                    <input
                        placeholder="Write your post"
                        value={newPostText}
                        onChange={e => setNewPostText(e.target.value)}
                    />
                </div>
                <input type="file" accept="image/*" onChange={e => handleImageSelect(e)} />
                {newImageUrl && <img 
                    src={newImageUrl}
                    alt="Post image" 
                    className="post-image"
                />}
                <button onClick={handleAddNewPost}>Send</button>
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
                    
                    <img 
                        src={`data:image/jpeg;base64,${post.image}`} 
                        alt="Post image" 
                        className="post-image"
                    />
                    <div className="post-actions">
                        <button className="like-btn">❤️</button>
                        <button className="comment-btn">💬</button>
                    </div>
                    <div className="post-details">
                        <span className="likes">{post.likes} likes</span>
                    </div>
                </div>
            ))}
            <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'Więcej postów'}
            </button>
        </div>
    );
};

export default PostsList;
