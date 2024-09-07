import "./init";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/HomePage.css'; // Import stylizacji

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Pobieranie postów
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/trainingappdb/posts/unicalPosts', {
                posts: [], // Jeśli to konieczne, przekazuj konkretne posty
                limit: 10,
                page: page
            });
            
            const newPosts = response.data;
            setPosts(prevPosts => [...prevPosts, ...newPosts]);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    // Ładowanie kolejnych postów
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    return (
        <div className="posts-container">
            {posts.map((post, index) => (
                <div key={index} className="post-card">
                    <div className="post-header">
                        <img src={post.userAvatar} alt="Avatar" className="avatar" />
                        <div className="post-info">
                            <span className="username">{post.username}</span>
                            <span className="post-time">{post.time}</span>
                            <h5>{post.content}</h5>
                        </div>
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
                        <span className="likes">{post.likes} polubień</span>
                        <p>{post.description}</p>
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
