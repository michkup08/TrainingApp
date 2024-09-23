import "./init";
import { useState, useEffect, useContext } from 'react';
import '../css/Trainers.css'; // Import stylizacji
import Post from "../DTO/Post";
import { PostsApi } from "../service/PostsApi";
import { UserContext } from "../context/UserContext";
import Trainer from "../DTO/Trainer";
import { TrainerApi } from "../service/TrainerApi";

const TrainersList = () => {
    const trainerApi = new TrainerApi();
    const user = useContext(UserContext);
    const postsApi = new PostsApi();
    const [trainers, setTrainers] = useState<Trainer>([]);
    const [posts, setPosts] = useState<Post>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        const newPosts = await postsApi.getPostsList([], 10);
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setLoading(false);
    };

    const fetchTrainers = async () => {
        setLoading(true);
        const newTrainers = await trainerApi.getTrainersList(0);
        setTrainers(prevTrainers => [...prevTrainers, ...newTrainers]);
        console.log(newTrainers);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
        fetchTrainers();
    }, [page]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const getInitials = (name:string) => {
        const parts = name.split(' ');
        return parts.map(part => part[0].toUpperCase()).join('');
    }

    return (
        <div className="trainers-container">
            {trainers.map((trainer:Trainer, index:number) => (
                <div key={index} className="trainer-card">
                    <div className="trainer-header">
                        <div className="trainer-avatar">{getInitials(trainer.fullName)}</div>
                        <div className="trainer-info">
                            <span className="username">{trainer.fullName}</span>                  
                        </div>
                    </div>
                    <div className="trainerContextWrapper">
                        <h4>{trainer.fullName}</h4>
                    </div>
                    {trainer.profileImage && (<img 
                        src={`data:image/jpeg;base64,${trainer.profileImage}`} 
                        alt="Post image" 
                        className="post-image"
                    />)}
                    
                </div>
            ))}
            <button onClick={handleLoadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'More trainers'}
            </button>
        </div>
    );
};

export default TrainersList;
